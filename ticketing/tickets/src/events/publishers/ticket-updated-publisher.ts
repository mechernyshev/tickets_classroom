import {Publisher, Subjects,TicketUpdatedEvent} from "@mcgittix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}