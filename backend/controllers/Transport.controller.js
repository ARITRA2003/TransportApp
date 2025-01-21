import { validationResult } from "express-validator";
import * as TransportService from "../services/Transport.service.js"
import * as MapService from "../services/map.service.js"
import { sendMessageToSocketId } from "../socket.js";
import TransportModel from "../models/Transport.model.js";


export const createTransportRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { originAddress, destinationAddress, vehicleType, weight, goodsDescription } = req.body;

    // Call the service to handle ride creation
    const originCoordinates = await MapService.getAddressCoordinates(originAddress);
    const destinationCoordinates = await MapService.getAddressCoordinates(destinationAddress);

    const origin = {
      address: originAddress,
      coordinates: originCoordinates
    }

    const destination = {
      address: destinationAddress,
      coordinates: destinationCoordinates
    }

    const ride = await TransportService.createTransportRideService(req.user.id, origin, destination, vehicleType, weight, goodsDescription);

    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });

    const driversInRadius = await MapService.getAllAvailableDriversInRadius(originCoordinates.lat, originCoordinates.lng, 5000);

    ride.originOtp = ride.destinationOtp = "";

    const rideWithUser = await TransportModel.findOne({ _id: ride._id })
      .populate({
        path: 'user', // The field in your schema that references the user (e.g., requester or driver)
        select: 'fullName', // Only fetch these fields from the user document
      });

    driversInRadius.map((driver) => {
      sendMessageToSocketId(driver.socketId, {
        "event": "new-ride",
        "data": rideWithUser
      })
    })

  } catch (error) {

    console.error("Error creating ride:", error.message);
    return res.status(500).json({
      message: "Failed to create ride",
      error: error.message,
    });

  }
};

export const confirmTransportRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await TransportService.confirmTransportRideService(req.driver.id, rideId);

    sendMessageToSocketId(ride.user.socketId, {
      event: "confirmed-ride",
      data: ride
    })
    ride.originOtp = ride.destinationOtp = "";
    res.status(200).json(ride);

  } catch (error) {
    console.error("Error in confirming ride:", error.message);
    return res.status(500).json({
      message: "Failed to confirm ride",
      error: error.message,
    });

  }
};


export const startTransportRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, status } = req.body;

  try {
    const ride = await TransportService.startTransportRideService(rideId, status);

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-status-updated",
      data: {
        _id: ride._id,
        status: ride.status
      },
    });

    res.status(200).json(ride);

  } catch (error) {
    console.error("Error in confirming ride:", error.message);
    return res.status(500).json({
      message: "Failed to confirm ride",
      error: error.message,
    });

  }
};

export const goodsCollectedTransportRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, status, originOtp } = req.body;

  try {
    // Call service function to update status and get populated ride data
    const ride = await TransportService.goodsCollectedTransportRideService(rideId, status, originOtp);

    // Send updated ride status to the user via socket
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-status-updated",
      data: {
        _id: ride._id,
        status: ride.status
      },
    });

    res.status(200).json({ rideId: ride._id, status: ride.status });

  } catch (error) {
    console.error("Error in confirming ride:", error.message);
    return res.status(500).json({
      message: "Failed to confirm ride",
      error: error.message,
    });
  }
}

export const goodsDeliveredTransportRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, status, destinationOtp } = req.body;

  try {
    const ride = await TransportService.goodsDeliveredTransportRideService(rideId, status, destinationOtp);

    // Emit an event to the user via socket
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-status-updated",
      data: {
        _id: ride._id,
        status: ride.status, // Only send rideId and status
      }
    });

    // Respond with the ride data
    res.status(200).json({
      rideId: ride._id,
      status: ride.status,
    });

  } catch (error) {
    console.error("Error in confirming goods delivery:", error.message);
    return res.status(500).json({
      message: "Failed to confirm goods delivery",
      error: error.message,
    });
  }
}

export const getAllUserRides = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing or not authenticated",
      });
    }

    const allUserRides = await TransportService.getAllUserRidesService(userId);
    // Respond with the fetched rides
    res.status(200).json(allUserRides);
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to get the rides",
      error: e,
    });
  }
}

export const getCurrentDriverRide = async (req, res, next) => {
  try {
    const userId = req.driver?._id;

    if (!userId) {
      return res.status(400).json({
        message: "Driver ID is missing or not authenticated",
      });
    }

    const driverCurrentRide = await TransportService.getCurrentDriverRideService(userId);
    // Respond with the fetched rides
    res.status(200).json(driverCurrentRide);
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to get the rides",
      error: e,
    });
  }
}
