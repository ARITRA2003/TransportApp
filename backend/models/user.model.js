import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'first name must be atleast 3 characters']
        },
        lastName: {
            type: String,
            required: true,
            minlength: [3, 'last name must be atleast 3 characters']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'email must be atleast 3 characters']
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    socketId: {
        type: String,
    }
});

userSchema.methods.generatedAuthtoken = function () {
    return jwt.sign({ "_id": this._id }, process.env.JWT_SECRET,{expiresIn:'24h'});
};

userSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('user', userSchema);

export default userModel;