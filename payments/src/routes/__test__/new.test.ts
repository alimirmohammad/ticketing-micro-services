import { Types } from "mongoose";
import request from "supertest";
import { OrderStatus } from "@amticketingorg/common";

import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
// import { Payment } from "../../models/payment";

jest.mock("../../stripe.ts");
// jest.setTimeout(60000);

it("returns 404 when purchasing an order that does not exist", async function () {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "some-token",
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to the user", async function () {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    version: 0,
    userId: new Types.ObjectId().toHexString(),
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "some-token",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 when purchasing a cancelled order", async function () {
  const userId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "some-token",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 201 with valid inputs", async function () {
  const userId = new Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100_000);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    version: 0,
    userId,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.currency).toEqual("usd");
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);

  // const stripeCharges = await stripe.charges.list();
  // const stripeCharge = stripeCharges.data.find(
  //   (charge) => charge.amount === price * 100
  // );
  // expect(stripeCharge).toBeDefined();
  // expect(stripeCharge!.currency).toEqual("usd");

  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: stripeCharge!.id,
  // });
  // expect(payment).not.toBeNull();
});
