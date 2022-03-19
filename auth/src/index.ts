import mongoose from "mongoose";
import { app } from "./app";

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not found");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on 3000!!");
  });
}

start();
