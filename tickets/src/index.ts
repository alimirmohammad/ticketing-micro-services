import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL not found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID not found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID not found");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on 3000!!");
  });
}

start();
