import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@mcgittix/common";

it('returns 404 when purchasing order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '123',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('returns 401  error when trying to pay for another user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '123',
            orderId: order.id
        })
        .expect(401)
})

it('returns 400 when purchasing cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: '123',
            orderId: order.id
        })
        .expect(400)
})

