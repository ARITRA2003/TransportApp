import express from "express";
import * as TransportController from "../controllers/Transport.controller.js";
import { authDriver, authUser } from "../middleware/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/create-ride",
  [
    authUser, // Ensure the user is authenticated
    body('weight')
      .isNumeric()
      .withMessage('Weight must be a numeric value')
      .isFloat({ gt: 0 })
      .withMessage('Weight must be greater than 0'),
    body('origin')
      .isString()
      .withMessage('Origin must be a valid string')
      .isLength({ min: 3 })
      .withMessage('Origin must be at least 3 characters long'),
    body('destination')
      .isString()
      .withMessage('Destination must be a valid string')
      .isLength({ min: 3 })
      .withMessage('Destination must be at least 3 characters long'),
    body('vehicleType')
      .isString()
      .withMessage('Vehicle type must be a valid string')
      .isIn(["Truck", "Van", "Mini Truck", "Container Truck", "Trailer"])
      .withMessage(
        'Vehicle type must be one of the following: Truck, Van, Mini Truck, Container Truck, Trailer'
      ),
      body('goodsDescription')
      .isString()
      .withMessage('Goods Description must be a valid string')
      .isLength({ min: 10 })
      .withMessage('Destination must be at least 10 characters long'),
  ],
  TransportController.createTransportRide
);

router.post(
  "/confirm-ride",
  [
    authDriver,
    body('rideId').isMongoId().withMessage("Not a Ride Id")
  ],
  TransportController.confirmTransportRide
);

router.get("/user-rides",
  authUser,
  TransportController.getAllUserRides
);

export default router;
