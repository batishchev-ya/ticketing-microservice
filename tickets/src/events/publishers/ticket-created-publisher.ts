import { Publisher, Subjects, TicketCreatedEvent } from "@yabtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
};

