import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";

it("returns a 404 if the provided id does not exist", async function () {
  const id = new Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "jsdhjfb", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async function () {
  const id = new Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "jsdhjfb", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async function () {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "fghfg", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "dfsf", price: 2000 })
    .expect(401);
});

it("returns a 400 if the user does not provide a valid title or price", async function () {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "fghfg", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 2000 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "abcd", price: -10 })
    .expect(400);
});

it("updates the ticket provided the valid inputs", async function () {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "fghfg", price: 20 });

  const newTitle = "hjkhjk";
  const newPrice = 300;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});
