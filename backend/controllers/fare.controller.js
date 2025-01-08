import pkg from "express-validator"
import * as fareService from "../services/fare.service.js"
import { getDistanceTime } from "../services/map.service.js";
    
const { validationResult } = pkg;

export const fareController = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {weight,origin,destination} = req.body;
    try{
        const {distance,duration} = await getDistanceTime(origin, destination);
        // distance.value is in meters and duration.value is in minutes
        if (!distance || !duration) {
            throw new Error("Unable to calculate distance or duration");
        }
        const allVehiclesFares = await fareService.calculateFares(distance.value,weight);
        res.status(200).json(allVehiclesFares); 
    }
    catch(e){
        console.log(e);
        res.status(400).json({message:"Not able to get all the fares"});
    }
}