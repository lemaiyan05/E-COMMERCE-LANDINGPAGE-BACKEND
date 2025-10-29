// -------------------- IMPORTS --------------------
require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

// -------------------- STRIPE CONFIG --------------------
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Redirect users to the home page after payment success
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/';

// -------------------- MAIN SERVER SETUP --------------------
const dotenv = require('dotenv');
dotenv.config();

// ✅ Import Firebase (loads when server starts)
require('./config/firebase');

// ✅ Import routes
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth')

// -------------------- APP INITIALIZATION --------------------
const app = express();

// ✅ Middleware
app.use(cors({ origin: ["http://localhost:5173", FRONTEND_URL], credentials: true }));
app.use(express.json());

// -------------------- STRIPE ROUTE --------------------
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    };

    // ✅ Create a Checkout session
    const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Website Payment' },
        unit_amount: amount, // amount in cents
      },
      quantity: 1,
    },
  ],
  mode: 'payment',

  // ✅ Redirect URLs
  success_url: `${FRONTEND_URL}?status=success`, // goes to homepage
  cancel_url: `${FRONTEND_URL}?status=failed`,  // back to homepage or error
});

  res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- OTHER API ROUTES --------------------
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// -------------------- FALLBACK ROUTE --------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// -------------------- CENTRALIZED ERROR HANDLING --------------------
app.use((err, req, res, next) => {
  console.error('❌ Error stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!',
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
