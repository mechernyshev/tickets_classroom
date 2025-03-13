import Queue from 'bull';
import {ExpirationCompletePublisher} from "../events/publishers/expiration-complete-publisher";
import {natsWrapper} from "../nats-wrapper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        port: 6379,
        host: process.env.REDIS_HOST,
    }
});

expirationQueue.process(async job => {
    console.log(`Processing job ${job.id}, order: ${job.data.orderId}`);
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
})

export {expirationQueue};