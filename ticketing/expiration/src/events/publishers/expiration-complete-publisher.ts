import {ExpirationCompleteEvent, Publisher, Subjects} from "@mcgittix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}