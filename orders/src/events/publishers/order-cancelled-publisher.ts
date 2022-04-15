import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@amticketingorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
