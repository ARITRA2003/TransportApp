import TransportModel from "../models/Transport.model.js";
import { getDistanceTime } from "./map.service.js";
import crypto from "crypto";
import {calculateFare} from "./fare.service.js";


const generateOTP = (length = 6) => {
  if (length <= 0) {
    throw new Error("OTP length must be greater than 0");
  }

  // Generate random bytes and convert them to a decimal number
  const otp = crypto.randomInt(0, Math.pow(10, length));

  // Ensure the OTP has the correct length by padding with leading zeros
  return otp.toString().padStart(length, "0");
};

export const createTransportRideService = async (userId, origin, destination, vehicleType, weight,goodsDescription) => {
  // Step 1: Calculate distance and time
  if(!userId || !origin || !destination || !vehicleType || !weight || !goodsDescription) {
    throw new Error("All fields are required")
  }
  const {distance,duration} = await getDistanceTime(origin, destination);
  // distance.value is in meters and duration.value is in minutes
  if (!distance || !duration) {
    throw new Error("Unable to calculate distance or duration");
  }

  // Step 2: Calculate fare
  let fare = await calculateFare(distance.value, weight,vehicleType);

  // Step 3: Create the ride in the database
  try {
    const ride = new TransportModel({
      user: userId,
      origin,
      destination,
      vehicleType,
      weight,
      distance:distance.value,
      estimatedTime: duration.value * 60, 
      // duration value is in minutes , converting into seconds
      price: fare,
      goodsDescription,
      originOtp : generateOTP(6),      // duration value is in minutes , converting into seconds
      destinationOtp : generateOTP(6)
    });

    // console.log(ride);
  
    await ride.save();
    return ride; // Return the created ride object if needed

  } catch (error) {
    console.error("Error creating transport ride:", error.message);
    throw new Error("Failed to create transport ride");
  }
};

export const confirmTransportRideService = async(DriverId,rideId) => {
  if(!DriverId) {
    throw Error("Not a Valid Driver Id")
  }

  await TransportModel.findByIdAndUpdate(
    rideId,{
    "status": "Accepted",
    "driver": DriverId
  });

  const ride = await TransportModel.findById(rideId).populate('user');
  return ride;
}
