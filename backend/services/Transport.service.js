import TransportModel from "../models/Transport.model.js";
import * as MapService from "./map.service.js";
import * as DriverService from "../services/driver.service.js";
import crypto from "crypto";
import { calculateFare } from "./fare.service.js";

const generateOTP = (length = 6) => {
  if (length <= 0) {
    throw new Error("OTP length must be greater than 0");
  }

  // Generate random bytes and convert them to a decimal number
  const otp = crypto.randomInt(0, Math.pow(10, length));

  // Ensure the OTP has the correct length by padding with leading zeros
  return otp.toString().padStart(length, "0");
};

export const createTransportRideService = async (userId, origin, destination, vehicleType, weight, goodsDescription) => {
  // Step 1: Calculate distance and time
  if (!userId || !origin || !destination || !vehicleType || !weight || !goodsDescription) {
    throw new Error("All fields are required")
  }
  const { distance, duration } = await MapService.getDistanceTime(origin.address, destination.address);
  // distance.value is in meters and duration.value is in minutes
  if (!distance || !duration) {
    throw new Error("Unable to calculate distance or duration");
  } 

  // Step 2: Calculate fare
  let fare = await calculateFare(distance.value, weight, vehicleType);

  // Step 3: Create the ride in the database
  try {
    const ride = new TransportModel({
      user: userId,
      origin,
      destination,
      vehicleType,
      weight,
      distance: distance.value,
      estimatedTime: duration.value * 60,
      // duration value is in minutes , converting into seconds
      price: fare,
      goodsDescription,
      originOtp: generateOTP(6),      // duration value is in minutes , converting into seconds
      destinationOtp: generateOTP(6)
    });

    await ride.save();
    return ride; // Return the created ride object if needed

  } catch (error) {
    console.error("Error creating transport ride:", error.message);
    throw new Error("Failed to create transport ride");
  }
};

export const confirmTransportRideService = async (driverId, rideId) => {
  if (!driverId) {
    throw Error("Not a Valid Driver Id")
  }

  await TransportModel.findByIdAndUpdate(
    rideId, {
    "status": "Accepted",
    "driver": driverId
  });

  // await DriverService.updateDriver(driverId,{"status":"unavailable"}) 

  const ride = await TransportModel.findById(rideId).
    populate('user').
    populate('driver').
    select("+originOtp").
    select("+destinationOtp");

  return ride;
}


export const startTransportRideService = async (rideId, status) => {
  // console.log(status);
  await TransportModel.findByIdAndUpdate(
    rideId, {
    "status": status,
  });

  const ride = await TransportModel.findById(rideId).
    populate('user');

  return ride;
}

export const goodsCollectedTransportRideService = async (rideId, status, originOtp) => {
  try {
    // Find the ride and populate only the user details
    const ride = await TransportModel.findById(rideId).
      populate("user").
      select("+originOtp"); // Only populate user details

    if (!ride) {
      throw new Error("Ride not found");
    }
    // Validate the OTP
    if (ride.originOtp !== originOtp) {
      throw new Error("Invalid OTP provided");
    }

    // Update the ride status
    ride.status = status;
    await ride.save();

    // Return populated ride with user details
    return ride;
  } catch (error) {
    console.error("Error in goodsCollectedTransportRideService:", error);
    throw new Error(error.message);
  }
};

export const goodsDeliveredTransportRideService = async (rideId, status, destinationOtp) => {
  try {
    // Find the ride and populate the user details
    const ride = await TransportModel.findById(rideId).
      populate("user").
      select("+destinationOtp"); // Populate only user details

    if (!ride) {
      throw new Error("Ride not found");
    }

    // Validate the OTP (destination OTP in this case)
    if (ride.destinationOtp !== destinationOtp) {
      throw new Error("Invalid destination OTP provided");
    }

    // Update the ride status to 'Goods Delivered'
    ride.status = status;
    await ride.save();

    // Return populated ride with user details
    return ride;
  } catch (error) {
    console.error("Error in goodsDeliveredTransportRideService:", error);
    throw new Error(error.message);
  }
};

export const getAllUserRidesService = async (userId) => {
  const query = {
    user: userId,
    status: {
      $in: ["Waiting For Driver", "Accepted", "Goods Collected", "En-route"],
    },
  };

  // Fetch rides based on the query
  const allUserRides = await TransportModel.find(query)
    .lean()
    .populate({
      path: "driver",
      match: { status: { $ne: "Waiting For Driver" } }, // Populate only if status is not "Waiting For Driver"
    }).
    select("+originOtp").
    select("+destinationOtp");

  // Check if no rides were found
  if (!allUserRides) {
    throw new Error("Error in fetching Ongoing Rides");
  }

  return allUserRides;
}

export const getCurrentDriverRideService = async (driverId) => {
  const query = {
    driver: driverId,
    status: {
      $in: ["Accepted", "Goods Collected", "En-route"]
    },
  };

  // Fetch rides based on the query
  const currentDriverRide = await TransportModel.find(query)
    .lean()
    .populate({
      path: "user",
      select: "fullName"
    })

  if (!currentDriverRide) {
    throw new Error("Error in fetching Ongoing Ride");
  }

  return currentDriverRide;
}