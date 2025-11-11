const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', protect, async (req, res) => {
    const { courseId, courseName, coursePrice } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: courseName,
                    },
                    unit_amount: Math.round(coursePrice * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/courses/${courseId}`,
            metadata: {
                userId: req.user.id,
                courseId: courseId,
            }
        });

        // --- THIS IS THE CHANGE ---
        // Instead of sending the ID, send the full checkout URL
        res.json({ url: session.url });
        // --- END OF CHANGE ---

    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({ error: 'Failed to create checkout session.' });
    }
});

module.exports = router;