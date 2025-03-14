import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {Order} from "../../../models/order";
import mongoose from "mongoose";
import {OrderStatus, ExpirationCompleteEvent} from "@mcgittix/common";
import {Message} from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asaklasdjlad',
        expiresAt: new Date(),
        ticket,
    })
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    // @ts-ignore
    const msg: Message[] = {
        // @ts-ignore
        ack: jest.fn(),
    }

    return {listener, order, data, msg};
}

it('marks an order as cancelled', async () => {
    const { listener, order, data, msg } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emit order cancelled event', async () => {
    const { listener, order, data, msg } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);

})

it('acks the message', async () => {
    const { listener, order, data, msg } = await setup();

    // @ts-ignore
    await listener.onMessage(data, msg);

    // @ts-ignore
    expect(msg.ack).toHaveBeenCalled();
})