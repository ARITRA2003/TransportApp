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
  
    const { origin, destination, vehicleType, weight,goodsDescription } = req.body;
  
    try {
      // Call the service to handle ride creation
      const ride = await TransportService.createTransportRideService(req.user.id, origin, destination, vehicleType, weight,goodsDescription);
  
      res.status(201).json({
        message: "Ride created successfully",
        ride,
      });

      const originCoordinates = await MapService.getAddressCoordinates(origin);
      
      const driversInRadius = await MapService.getDriversInRadius(originCoordinates.lat,originCoordinates.lng,5000);

      ride.originOtp = ride.destinationOtp = "";

      const rideWithUser = await TransportModel.findOne({ _id: ride._id })
      .populate({
        path: 'user', // The field in your schema that references the user (e.g., requester or driver)
        select: 'fullName', // Only fetch these fields from the user document
      });

      driversInRadius.map((driver)=>{
        sendMessageToSocketId(driver.socketId,{
          "event":"new-ride",
          "data":rideWithUser
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

  const {rideId} = req.body;

  try {
    const ride = await TransportService.confirmTransportRideService(req.driver.id,rideId);
    
    sendMessageToSocketId(ride.user.socketId,{
      "event":"confirmed-ride",
      "data":ride
    })

    res.status(200).json(ride);

  } catch (error) {
    console.error("Error in confirming ride:", error.message);
    return res.status(500).json({
      message: "Failed to confirm ride",
      error: error.message,
    });

  }
};

export const getAllUserRides = async (req, res, next) =>{
  try {
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(400).json({
          message: "User ID is missing or not authenticated",
        });
      }
  
      // Define the query with the allowed statuses
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
        select: "fullName vehicle", // Add driver fields to be populated
        match: { status: { $ne: "Waiting For Driver" } }, // Populate only if status is not "Waiting For Driver"
      });
  
      // Check if no rides were found
      if (!allUserRides || allUserRides.length === 0) {
        return res.status(404).json({
          message: "No rides found for the user",
        });
      }
  
      // Respond with the fetched rides
      res.status(200).json(allUserRides);
  }
  catch(e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to get the rides",
      error: e,
    });
  } 
}
