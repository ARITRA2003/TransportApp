import userModel from "../models/user.model.js";
import pkg from "express-validator";
import * as userService from "../services/user.service.js";
import blackListTokenModel from "../models/blackListToken.model.js";

const {validationResult} = pkg;

export const registerUser = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    const {fullName,password,email} = req.body;

    const isUserAlreadyRegistered =await userModel.findOne({email:email});

    if(isUserAlreadyRegistered) {
        return res.status(400).json({message:"User Already Registered"});
    }

    const hashedPassword =await userModel.hashedPassword(password);
    
    try{
        const user =await userService.createUser({
            firstName : fullName.firstName,
            lastName :fullName.lastName,
            email,
            password:hashedPassword
        });

        // console.log(user);

        const token =await user.generatedAuthtoken();

        // console.log(token);

        res.cookie('token',token);

        res.status(201).json({token,user});
    }
    catch(e) {
        console.log(e);
    }
    next();
}

export const loginUser = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    const {password,email} = req.body;
    
    try{
        const user =await userModel.findOne({email:email}).select("+password");

        if(!user) {
            return res.status(401).json({message:"Invalid email or password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token =await user.generatedAuthtoken();
        
        res.cookie('token',token);

        res.status(201).json({token,user});
    }
    catch(e) {
        console.log(e);
    }
    next();
}

export const getProfile = async(req,res,next) => {
    return res.status(200).json(req.user);
};

export const logoutUser = async(req,res,next) =>{
    const token =  req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    await blackListTokenModel.create({token});
    
    res.clearCookie(token);
    
    res.status(200).json({message:"logged Out Successfully"});
};