import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@amticketingorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
