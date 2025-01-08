import userModel from "../models/user.model.js";
import pkg from "express-validator";
import * as userService from "../services/user.service.js";
import blackListTokenModel from "../models/blackListToken.model.js";

const { validationResult } = pkg;

export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, password, email } = req.body;

    const isUserAlreadyRegistered = await userModel.findOne({ email: email });

    if (isUserAlreadyRegistered) {
        return res.status(400).json({ message: "User Already Registered" });
    }

    const hashedPassword = await userModel.hashedPassword(password);

    try {
        const user = await userService.createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword
        });

        // console.log(user);

        const token = await user.generatedAuthtoken();

        // console.log(token);

        res.cookie('token', token);

        res.status(201).json({ token, user });
    }
    catch (e) {
        console.log(e);
    }
    next();
}

export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password, email } = req.body;

    try {
        const user = await userModel.findOne({ email: email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = await user.generatedAuthtoken();

        res.cookie('token', token);

        res.status(200).json({ token, user });
    }
    catch (e) {
        console.log(e);
    }
    next();
}

export const getProfile = async (req, res, next) => {
    return res.status(200).json(req.user);
};

export const updateProfile = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const updatedUser = await userService.updateUser(req.user,req.body);
        res.status(200).json(updatedUser);
    }
    catch(e){
        console.error('Error updating profile:', e);
        res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
}

export const logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    res.clearCookie(token);
    // console.log(token);
    try {
        if (token) {
            // Check if the token already exists in the blacklist
            const existingToken = await blackListTokenModel.findOne({ token });
            if (!existingToken) {
                // Add the token to the blacklist if not already present
                await blackListTokenModel.create({ token });
            }
        }
        return res.status(200).json({ message: "logged Out Successfully" });
    }
    catch (e) {
        console.log(e);
    }
};

