import express from "express"
import {body} from "express-validator"
import { authUser } from "../middleware/auth.middleware.js";
import { fareController } from "../controllers/fare.controller.js";

const router = express.Router();

router.post("/calculate-fares",
    [
    authUser,
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
    ],
    fareController
);

export default router;