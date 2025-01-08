import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToMongo } from "./db/db.js";
import userRouter from "./routes/user.route.js"
import driverRouter from "./routes/driver.route.js";
import mapRouter from "./routes/map.route.js";
import transportRouter from "./routes/Transport.route.js";
import fareCalculationRouter  from "./routes/fare.route.js";

dotenv.config();

connectToMongo();

const app = express();

//Required configurations  
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//Routes
app.use("/user",userRouter);
app.use("/driver",driverRouter);
app.use("/map",mapRouter);
app.use("/ride",transportRouter);
app.use("/fare",fareCalculationRouter);

app.get("/",(req,res) => {
    res.send("Hello, world");
});

export default app;
