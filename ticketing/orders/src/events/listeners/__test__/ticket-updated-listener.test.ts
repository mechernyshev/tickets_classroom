import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketUpdatedEvent} from "@mcgittix/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {TicketUpdatedListener} from "../ticket-updated-listener";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };


    // @ts-ignore
    const msg: Message[] = {
        // @ts-ignore
        ack: jest.fn(),
    }

    return {listener, data, msg, ticket};
}

it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket} = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const { listener, data, msg, ticket} = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    // @ts-ignore
    expect(msg.ack).toHaveBeenCalled();
})

it('does not update if version is not incremented', async () => {
    const { listener, data, msg, ticket} = await setup();

    data.version = 10;

    try {
        // @ts-ignore
        await listener.onMessage(data, msg);
    } catch (err) {}

    // @ts-ignore
    expect(msg.ack).not.toHaveBeenCalled();
})
