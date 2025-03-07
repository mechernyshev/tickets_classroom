import { Publisher, OrderCancelledEvent, Subjects } from "@mcgittix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}