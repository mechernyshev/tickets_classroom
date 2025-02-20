import mongoose from 'mongoose';

// attributes necessary to create a ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// that's how Ticket may look like, note that we may have here additional fields such as CreatedAt or somewhat similar, which can be added automatically by Mongo DB
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

interface TicketModels extends mongoose.Model <TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModels>('Ticket', ticketSchema);

export {Ticket};