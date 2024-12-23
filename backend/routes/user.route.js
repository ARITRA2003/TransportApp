import express from "express"
import {body} from "express-validator"
import * as userController from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",[
     body('email').isEmail().withMessage('Not a valid e-mail address'),
     body('password').isLength({ min: 8 }).withMessage("password must be atleast 8 characters"),
     body('fullName.firstName').isLength({min:3}).withMessage('Must be atleast 3 characters'),
     body('fullName.lastName').isLength({min:3}).withMessage('Must be atleast 3 characters')
],
userController.registerUser 
);


router.post("/login",[
     body('email').isEmail().withMessage('Not a valid e-mail address'),
     body('password').isLength({ min: 8 }).withMessage("password must be atleast 8 characters"),
],
userController.loginUser 
);

router.get("/getProfile",authUser,userController.getProfile
);

router.get("/logout",authUser,userController.logoutUser
);

export default router;