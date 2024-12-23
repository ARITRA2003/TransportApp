import driverModel from "../models/driver.model.js";


export const createDriver = ({firstName,lastName,email,password,color,plate,capacity,vehicleType}) => {
    if(!firstName || !lastName || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error("All fields are required");
    }
    try{
        const driver = driverModel.create({
            fullName:{
                firstName,
                lastName
            },
            email:email,
            password:password,
            vehicle:{
                color,
                plate,
                capacity,
                vehicleType
            }
        });

        return driver;
    } catch (error) {
        // Handle any errors during Driver creation (e.g., validation or database errors)
        throw new Error(`User creation failed: ${error.message}`);
    }
};