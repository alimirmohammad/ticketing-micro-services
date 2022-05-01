import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@amticketingorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
