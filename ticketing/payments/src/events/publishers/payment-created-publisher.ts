import {Subjects, Publisher, PaymentCreatedEvent} from "@mcgittix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}