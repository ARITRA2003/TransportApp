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
    body('originAddress')
      .isString()
      .withMessage('Origin Address must be a valid string')
      .isLength({ min: 3 })
      .withMessage('Origin Address must be at least 3 characters long'),
    body('destinationAddress')
      .isString()
      .withMessage('Destination Address must be a valid string')
      .isLength({ min: 3 })
      .withMessage('Destination Address must be at least 3 characters long'),
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

router.post("/start-ride",[
  authDriver,
  body('rideId').isMongoId().withMessage("Not a Ride Id"),
  body('status').
  isIn(["Waiting For Driver","Accepted","Goods Collected","En-route","Goods Delivered"]).
  withMessage("Status is not valid")
  ],
  TransportController.startTransportRide
);

router.post(
  "/goods-collected",
  [
    authDriver,
    body("rideId").isMongoId().withMessage("Not a valid Ride ID"),
    body("status")
      .isIn([
        "Waiting For Driver",
        "Accepted",
        "Goods Collected",
        "En-route",
        "Goods Delivered",
      ])
      .withMessage("Status is not valid"),
    body("originOtp")
      .isLength({ min: 6, max: 6 })
      .isString()
      .withMessage("OTP must be a 6-digit numeric code"),
  ],
  TransportController.goodsCollectedTransportRide
);

router.post(
  "/goods-delivered",
  [
    authDriver,
    body("rideId").isMongoId().withMessage("Not a valid Ride ID"),
    body("status")
      .isIn([
        "Waiting For Driver",
        "Accepted",
        "Goods Collected",
        "En-route",
        "Goods Delivered",
      ])
      .withMessage("Status is not valid"),
    body("destinationOtp")
      .isLength({ min: 6, max: 6 })
      .isString()
      .withMessage("OTP must be a 6-digit numeric code"),
  ],
  TransportController.goodsDeliveredTransportRide
);

router.get('/user-rides',
  authUser,
  TransportController.getAllUserRides
);

router.get("/driver-current-ride",
  authDriver,
  TransportController.getCurrentDriverRide
);

export default router;
