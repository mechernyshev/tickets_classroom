import {Publisher, Subjects,TicketCreatedEvent} from "@mcgittix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}