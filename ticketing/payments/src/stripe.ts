export const stripe = require('stripe')(process.env.STRIPE_KEY!, {
    apiVersion: '2025-02-24.acacia',
});