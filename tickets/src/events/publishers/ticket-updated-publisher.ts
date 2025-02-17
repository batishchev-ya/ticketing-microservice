import { Publisher, Subjects, TicketUpdatedEvent } from "@yabtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
};

