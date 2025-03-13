import {Listener, OrderCreatedEvent, Subjects} from "@mcgittix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreateListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        console.log(`Order ${data.id} is due in ${delay / 1000} seconds`);

        await expirationQueue.add({
            orderId: data.id
        },{
            delay,
        });
        msg.ack();
    }
}