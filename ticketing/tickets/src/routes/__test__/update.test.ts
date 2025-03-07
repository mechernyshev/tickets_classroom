import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the ticket does not exist ', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 200
        })
        .expect(404);
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'aslkdfj',
            price: 20,
        })
        .expect(401);
});

it('returns 401 if the user tries to update a ticket which does not belong to him/her ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 200
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert #2',
            price: 2000
        })
        .expect(401);
})

it('returns 400 if the user provides invalid title or price ', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 200
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 200,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: -10,
        })
        .expect(400);

})

it('updates the ticket provided valid input', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 200
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
})


it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 200
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});