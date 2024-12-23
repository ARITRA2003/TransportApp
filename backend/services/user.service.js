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

