import { Listener, OrderCreatedEvent, Subjects} from "@mcgittix/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";
import {TicketUpdatedEvent} from "@mcgittix/common";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the ticket
        const ticket = await Ticket.findById(data.ticket.id);

        // if no ticket - throw errow
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        //mark the ticket as reserved by setting order id prop
        ticket.set({orderId: data.id});

        // save the ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            orderId: data.id,
            userId: data.userId,
            version: ticket.version
        })


        //ack the message
        msg.ack();
    }
}