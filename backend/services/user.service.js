import userModel from "../models/user.model.js";

export const createUser = async({firstName,lastName,email,password}) => {
    if(!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
    }
    try{
        const user = userModel.create({
            fullName:{
                firstName,
                lastName
            },
            email,
            password
        });

        return user;
    } catch (error) {
        // Handle any errors during user creation (e.g., validation or database errors)
        throw new Error(`User creation failed: ${error.message}`);
    }
}

export const updateUser = async(userId,updationProfileData) => {
    if(!userId || !updationProfileData) {
       throw new Error("All fields are required")
    }
    try{
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { $set: updationProfileData },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        return updatedUser;
    } catch (error) {
        // Handle any errors during user updation (e.g., validation or database errors)
        throw new Error(`User updation failed: ${error.message}`);
    }
}

