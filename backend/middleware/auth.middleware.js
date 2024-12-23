import blackListTokenModel from "../models/blackListToken.model.js";
import driverModel from "../models/driver.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authUser = async(req,res,next) => {
    const token =  req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log(req.header.authorization);
    if(!token) {
        return res.status(401).json({message:"UnAuthorized User"});
    }

    const isBlackListed = await blackListTokenModel.findOne({token : token});
    // console.log(isBlackListed);
    if(isBlackListed) {
        return res.status(401).json({message:"UnAuthorized User"});
    }

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken._id);
        req.user = user;

        return next();
    }
    catch(e) {
        return res.status(401).json({message:"UnAuthorized User"});
    }
};


export const authDriver = async(req,res,next) => {
    const token =  req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log(req.header.authorization);
    if(!token) {
        return res.status(401).json({message:"UnAuthorized User"});
    }

    const isBlackListed = await blackListTokenModel.findOne({token : token});
    // console.log(isBlackListed);
    if(isBlackListed) {
        return res.status(401).json({message:"UnAuthorized User"});
    }

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const driver = await driverModel.findById(decodedToken._id);
        req.driver = driver;

        return next();
    }
    catch(e) {
        return res.status(401).json({message:"UnAuthorized User"});
    }
};