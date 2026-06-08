import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";

//Loads variables from .env into process.env.
dotenv.config();

await connectDb(); //Only after successful connection,start the Express server

const redisUrl= process.env.REDIS_URL;
if (!redisUrl){
    console.log("Missing Redis url");
    process.exit(1);
}

export const redisClient = createClient({
    url: redisUrl,
});

redisClient.connect()
.then(() => 
    console.log("Connected to Redis")).catch(console.error);

const app = express(); //Creates an Express application.

//middlewares
app.use(express.json());

import userRoutes from "./routes/user.js";
//using routes
app.use("/api/v1", userRoutes);

const PORT= process.env.PORT || 5000; // if PORT then yes else 5000

//Starts the server and tells it to listen for incoming requests.
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});