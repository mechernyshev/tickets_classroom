import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from "@mcgittix/common";
import {Ticket} from "../models/ticket";
import { NotFoundError } from "@mcgittix/common";

const router = express.Router();

router.get('/api/tickets/:id', validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
})

export {router as showTicketRouter};