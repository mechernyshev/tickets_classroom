import {Publisher, OrderCreatedEvent, Subjects} from "@mcgittix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}