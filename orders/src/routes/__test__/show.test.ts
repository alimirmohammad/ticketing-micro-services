import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns an error if the user does not own the order", async function () {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("fetches the order", async function () {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(createdOrder.id).toEqual(fetchedOrder.id);
});
