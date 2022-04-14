import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@amticketingorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
