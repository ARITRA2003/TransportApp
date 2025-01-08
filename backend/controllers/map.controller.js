import * as mapService from "../services/map.service.js"
import pkg from "express-validator"

const { validationResult } = pkg;

export const getCoordinate = async(req,res,next) => {
    const errors = validationResult(pkg);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        res.status(200).json(coordinates);
    }
    catch(e) {
        res.status(404).json({message:"coordinates not found"})
    }
}

export const getDistanceTime = async (req, res, next) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract query parameters
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res
            .status(400)
            .json({ message: "Both origin and destination are required." });
    }

    try {
        // Delegate to mapService to fetch the required data
        const result = await mapService.getDistanceTime(origin, destination);

        // Send the result from the service to the client
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getDistanceTime:", error.message);

        // Send a meaningful response
        return res
            .status(error.status || 500)
            .json({ message: error.message || "Internal Server Error" });
    }
};

export const getAutoCompleteSuggestions = async (req, res, next) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract query parameters
    const { input } = req.query;

    try {
        // Delegate to mapService to fetch the required data
        const result = await mapService.getAutoCompleteSuggestions(input);

        // Send the result from the service to the client
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getDistanceTime:", error.message);

        // Send a meaningful response
        return res
            .status(error.status || 500)
            .json({ message: error.message || "Internal Server Error" });
    }
};
