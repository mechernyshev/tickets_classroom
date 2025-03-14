import express, {Request, Response} from "express";
import {body} from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError, NotAuthorizedError, OrderStatus,
} from "@mcgittix/common";
import {Order} from "../models/order";


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

    // checiking if order was not found
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

    res.send({success: true});
})

export {router as createChargeRouter};