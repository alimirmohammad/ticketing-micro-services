import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../app";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async function () {
  process.env.JWT_KEY = "something";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async function () {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async function () {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async function () {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  return response.get("Set-Cookie");
};
