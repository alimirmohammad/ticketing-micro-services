import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@amticketingorg/common";

import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";

async function setup() {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: new Types.ObjectId().toHexString(),
    },
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { listener, data, msg, order };
}

it("updates the order status", async function () {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async function () {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
