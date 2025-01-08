import axios from "axios";
import driverModel from "../models/driver.model.js";

// Function to get coordinates from an address
export const getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        // console.log(response);
        // Check if the response status is OK and results are available
        if (response.data.status === "OK" && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
            };
        } else {
            throw new Error("Unable to fetch coordinates or no results found");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

export const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Both origin and destination are required.");
    }

    const apiKey = process.env.GOOGLE_MAP_API; // Your API Key
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === "OK" && response.data.rows.length > 0) {
            const element = response.data.rows[0].elements[0];
            if (element.status === "OK") {
                return element;
            } else {
                throw new Error(`Error in element: ${element.status}`);
            }
        } else {
            throw new Error("Unable to fetch distance or duration");
        }
    } catch (error) {
        console.error("Error fetching distance and time:", error.message);
        throw error; // Rethrow error for the calling function to handle
    }
};

export const getAutoCompleteSuggestions = async(input) => {
     if(!input) {
        throw new Error("Input is required.");
     }
     
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    
    try {
        const response = await axios.get(url);

        // Check if the response status is OK and predictions are available
        if (response.data.status === "OK" && response.data.predictions.length > 0) {
            // Return an array of place suggestions
            return response.data;
        } else if (response.data.status !== "OK") {
            throw new Error(`API Error: ${response.data.status}`);
        } else {
            throw new Error("No suggestions found.");
        }
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const getDriversInRadius = async (lat, lng, radius) => {
    try {
      // Convert radius from meters to radians (1 degree ≈ 111,320 meters)
      const radiusInRadians = radius / 6371;  // Earth's radius in meters
  
      const drivers = await driverModel.find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [lat, lng], 
              radiusInRadians  // Radius in radians
            ]
          }
        }
      });
  
      return drivers; 
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  };