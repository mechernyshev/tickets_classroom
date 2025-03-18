import express, {Request, Response} from "express";
import {body} from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError, NotAuthorizedError, OrderStatus,
} from "@mcgittix/common";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";


const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty()
            .withMessage('Stripe auth token is required'),
        body('orderId')
            .not()
            .isEmpty()
            .withMessage('OrderId is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

    const {token, orderId} = req.body;

    const order = await Order.findById(orderId);

    // checking if order was not found
    if (!order) {
        throw new NotFoundError();
    }

    // checking if user tries to pay for somebody else's order
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    // checking that the order isn't cancelled
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for cancelled order');
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
    })

    const payment = Payment.build({
        orderId,
        stripeId: charge.id,
    })
/*        // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100, // Amount in cents
        currency: 'usd',
        payment_method: token, // Token or payment method ID
    /!*            confirmation_method: 'manual', // Optional: Set manual or automatic confirmation
        confirm: true, // Confirm the payment immediately (if you have all details)*!/
    });*/

    res.status(201).send({success: true});
})

export {router as createChargeRouter};