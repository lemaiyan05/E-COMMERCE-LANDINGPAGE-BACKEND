// -------------------- IMPORTS --------------------
require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

// -------------------- STRIPE CONFIG --------------------
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// -------------------- FIREBASE --------------------
require('./config/firebase');

// -------------------- ROUTES --------------------
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

// -------------------- APP INITIALIZATION --------------------
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://jlmbrands.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// -------------------- STRIPE ROUTE --------------------
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Website Payment' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}?status=success`,
      cancel_url: `${FRONTEND_URL}?status=failed`,
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

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error('❌ Error stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!',
  });
});


console.log("✅ Allowed CORS origins:", [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://jlmbrands.netlify.app"
]);

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
