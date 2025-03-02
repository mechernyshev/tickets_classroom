import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
    url: 'nats://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const data = JSON.stringify({
        id: 1,
        title: 'concert',
        price: 10
    });

    stan.publish('ticket:created', data, () => {
        console.log('event published');
    });
})