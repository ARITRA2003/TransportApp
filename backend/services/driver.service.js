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
        throw new Error(`Driver creation failed: ${error.message}`);
    }
};

export const updateDriver = async(driverId,updationProfileData) => {
    if(!driverId || !updationProfileData) {
       throw new Error("All fields are required")
    }
    try{
        const updatedDriver = await driverModel.findByIdAndUpdate(
            driverId, 
            { $set: updationProfileData },
            { new: true, runValidators: true } 
        );

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        return updatedDriver;
    } catch (error) {
        // Handle any errors during Driver updation (e.g., validation or database errors)
        throw new Error(`Driver updation failed: ${error.message}`);
    }
}