import express from "express"
import {body} from "express-validator"
import * as driverController from "../controllers/driver.controller.js"
import { authDriver } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",[
    body('fullName.firstName').isLength({min:3}).withMessage('Must be atleast 3 characters'),
    body('fullName.lastName').isLength({min:3}).withMessage('Must be atleast 3 characters'),
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').isLength({ min: 8 }).withMessage("password must be atleast 8 characters"),
    body('vehicle.color').isLength({min:3}).withMessage('Must be atleast 3 characters'),
    body('vehicle.plate').isLength({min:3}).withMessage('Must be atleast 3 characters'),
    body('vehicle.capacity').isInt({min:10}).withMessage('Mimimum Capacity should be 10'),
    body('vehicle.vehicleType').isIn(["Truck", "Van", "Mini Truck", "Container Truck", "Trailer", "Three Wheeler"]).withMessage('Not a valid vehicle Type')
],

driverController.registerDriver
);


router.post("/login",[
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').isLength({ min: 8 }).withMessage("password must be atleast 8 characters"),
],
driverController.loginDriver
);

router.get("/getProfile",authDriver,driverController.getProfile
);

router.post("/updateProfile",
    [
        authDriver,
        body('fullName.firstName').optional().isLength({min:3}).withMessage('Must be atleast 3 characters'),
        body('fullName.lastName').optional().isLength({min:3}).withMessage('Must be atleast 3 characters'),
        body('vehicle.color').optional().isLength({min:3}).withMessage('Must be atleast 3 characters'),
        body('vehicle.plate').optional().isLength({min:3}).withMessage('Must be atleast 3 characters'),
        body('vehicle.capacity').optional().isInt({min:10}).withMessage('Mimimum Capacity should be 10'),
        body('vehicle.vehicleType').optional().isIn(["Truck", "Van", "Mini Truck", "Container Truck", "Trailer", "Three Wheeler"]).withMessage('Not a valid vehicle Type')
    ],
    driverController.updateProfile
)

router.get("/logout",authDriver,driverController.logoutDriver
);

export default router;