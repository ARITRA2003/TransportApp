import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URI= process.env.MONGO_DB_URI;

// console.log(MONGO_DB_URI);

export const connectToMongo = () => {
    mongoose.connect(MONGO_DB_URI)
    .then(
        async()=>{
            console.log("Connected to DB");
        }
    )
    .catch((e) => { console.log(e) });
}