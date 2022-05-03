import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@amticketingorg/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
