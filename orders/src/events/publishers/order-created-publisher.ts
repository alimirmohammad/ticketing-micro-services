import { Publisher, OrderCreatedEvent, Subjects } from "@amticketingorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
