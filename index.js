const express =require ("express");
const cors = require ("cors");
const bodyParser =require ("body-parser");
const authRoutes =require ("./routes/auth.js");
const contactRoutes = require  ("./routes/contact.js");
const productRoutes =require ("./routes/products.js");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);

export default app;
