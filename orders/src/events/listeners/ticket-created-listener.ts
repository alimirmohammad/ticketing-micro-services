import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@amticketingorg/common";

import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    msg.ack();
  }
}
