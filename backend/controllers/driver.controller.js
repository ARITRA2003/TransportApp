import driverModel from "../models/driver.model.js";
import pkg from "express-validator";
import * as driverService from "../services/driver.service.js"
import blackListTokenModel from "../models/blackListToken.model.js";

const { validationResult } = pkg;


export const registerDriver = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, password, email, vehicle } = req.body;

    const isDriverAlreadyRegistered = await driverModel.findOne({ email: email });

    if (isDriverAlreadyRegistered) {
        return res.status(400).json({ message: "Driver Already Registered" });
    }

    const hashedPassword = await driverModel.hashedPassword(password);

    try {
        const driver = await driverService.createDriver({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity
        });

        const token = await driver.generatedAuthtoken();

        res.cookie('token', token);

        res.status(201).json({ token, driver });
    }
    catch (e) {
        console.log(e);
    }
    next();
}

export const loginDriver = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {

        const { password, email } = req.body;

        const driver = await driverModel.findOne({ email: email }).select("+password");

        if (!driver) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await driver.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = await driver.generatedAuthtoken();

        res.cookie('token', token);

        res.status(201).json({ token, driver });
    }
    catch (e) {
        console.log(e);
    }
}

export const getProfile = async(req,res,next) =>{
    return res.status(200).json(req.driver);
}

export const logoutDriver = async(req,res,next) =>{
    const token =  req.cookies.token || req.headers.authorization?.split(' ')[1];
        
    await blackListTokenModel.create({token});
    
    res.clearCookie(token);
    
    res.status(200).json({message:"logged Out Successfully"});
}