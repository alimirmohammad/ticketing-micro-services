import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@amticketingorg/common";

import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";

async function setup() {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: new Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId: new Types.ObjectId().toHexString() });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { listener, data, msg, ticket };
}

it("updates the ticket, publishes an event, and acks the message", async function () {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});
