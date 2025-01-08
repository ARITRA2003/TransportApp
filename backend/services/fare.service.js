export const calculateFare = async (distance, weight,vehicleType) => {
    try {
  
      const distanceInKm = distance/1000;
      // Define base fare per kilometer for each vehicle type
      const fareRates = {
        "Truck": 10, // Base fare per km
        "Van": 8,
        "Mini Truck": 12,
        "Container Truck": 15,
        "Trailer": 20,
      };
  
      // Additional surcharge based on weight (per kg)
      const weightSurchargeRate = 0.15; // Example: 0.05 currency units per kg per km
  
      if (!fareRates[vehicleType]) {
        throw new Error("Invalid vehicle type");
      }
  
      // Calculate fare
      const baseFare = fareRates[vehicleType] * distanceInKm;
      const weightSurcharge = weight * weightSurchargeRate * distanceInKm;
      const totalFare = baseFare + weightSurcharge;
  
      return Math.ceil(totalFare);
    } catch (error) {
      console.error("Error calculating fare:", error.message);
      throw error;
    }
};

export const calculateFares = async (distance, weight) => {
    try {
      const distanceInKm = distance / 1000;
  
      // Define base fare per kilometer for each vehicle type
      const fareRates = {
        "Truck": 10, // Base fare per km
        "Van": 8,
        "Mini Truck": 12,
        "Container Truck": 15,
        "Trailer": 20,
      };
  
      // Additional surcharge based on weight (per kg per km)
      const weightSurchargeRate = 0.15; // Example: 0.05 currency units per kg per km
  
      const fareResults = {};
  
      // Calculate fare for each vehicle type
      for (const [vehicleType, baseRate] of Object.entries(fareRates)) {
        const baseFare = baseRate * distanceInKm;
        const weightSurcharge = weight * weightSurchargeRate * distanceInKm;
        const totalFare = baseFare + weightSurcharge;
  
        fareResults[vehicleType] = Math.ceil(totalFare); // Round up to the nearest integer
      }
  
      return fareResults;
    } catch (error) {
      console.error("Error calculating fares:", error.message);
      throw error;
    }
  };
  