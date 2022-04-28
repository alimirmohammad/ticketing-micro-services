import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@amticketingorg/common";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

function setup() {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 20,
    userId: new Types.ObjectId().toHexString(),
  };
  const msg = { ack: jest.fn() } as unknown as Message;

  return { listener, data, msg };
}

it("creates and saves a ticket", async function () {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async function () {
  const { listener, data, msg } = setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
