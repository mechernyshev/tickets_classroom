import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('fetches an order by id', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const user = global.signin();

    const { body : order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
})


it('returns an error for non-authorised user', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const user = global.signin();

    const { body : order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    //fetching as another user
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
})