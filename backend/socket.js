import { Server } from "socket.io";
import userModel from "./models/user.model.js";
import driverModel from "./models/driver.model.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Update this with your allowed origins in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handling user joining
    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data;

        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "driver") {
          await driverModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else {
          return socket.emit("error", { message: "Invalid user type" });
        }

        console.log(`Socket ID ${socket.id} linked to ${userType} with ID ${userId}`);
      } catch (error) {
        console.error("Error in join event:", error);
        socket.emit("error", { message: "Unable to join, please try again." });
      }
    });

    // Updating driver's locationin real-time
    socket.on("update-location-driver", async (data) => {
      try {
        const { driverId, location, userId, rideId } = data;
    
        // Validate location data
        if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
          return socket.emit("error", { message: "Invalid location data" });
        }
    
        // Validate driver ID
        if (!driverId) {
          return socket.emit("error", { message: "Driver ID is missing" });
        }
    
        // Update the driver's location in the database
        await driverModel.findByIdAndUpdate(driverId, {
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        });
        // console.log(`Updated location for driver with ID ${driverId}`);
    
        // If a userId is provided, notify the user about the driver's updated location
        if (userId) {
          console.log(`updating to the ${userId} with ride ${rideId}`);
          const user = await userModel.findById(userId);
    
          if (user && user.socketId) {
            sendMessageToSocketId(user.socketId, {
              event: "driver-location-update",
              data: {
                location: location,
                _id: rideId || null, // Include rideId if provided
              },
            });
          } else {
            console.warn(`Socket ID not found for user with ID ${userId}`);
          }
        }
      } catch (error) {
        console.error("Error updating driver location:", error);
        socket.emit("error", { message: "Unable to update location, please try again." });
      }
    });
    

    // Handling disconnection
    socket.on("disconnect", async (data) => {
      try {
        const { userId, userType } = data;

        // Optionally, update database to mark the user as offline
        if (userType === "user") {
          await userModel.findByIdAndUpdate({ userId }, { $unset: { socketId: "" } });
        } else if (userType === "driver") {
          await driverModel.findByIdAndUpdate({ userId }, { $unset: { socketId: "" } });
        } else {
          return socket.emit("error", { message: "Invalid user type" });
        }
        console.log(`Client disconnected: ${socket.id}`);
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });
};

// Utility to send messages to a specific socket ID
export const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    console.log(`Message sent to socket ID ${socketId}:`, messageObject);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

