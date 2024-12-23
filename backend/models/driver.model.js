import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const driverSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters']
        },
        lastName: {
            type: String,
            required: true,
            minlength: [3, 'Last name must be at least 3 characters']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available"
    },
    location: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters']
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity should be more than 1 kg']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ["Truck", "Van", "Mini Truck", "Container Truck", "Trailer", "Three Wheeler"]
        }
    }
});

driverSchema.methods.generatedAuthtoken = function () {
    return jwt.sign({ "_id": this._id }, process.env.JWT_SECRET,{expiresIn:'24h'});
};

driverSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

driverSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const driverModel = mongoose.model('driver', driverSchema);

export default driverModel;
