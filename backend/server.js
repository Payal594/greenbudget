const express = require("express");
const dotenv = require("dotenv").config({ path: './backend/.env' });
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const connection = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const farmerProfileRoutes = require("./routes/farmerProfile");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerProfileRoutes = require('./routes/sellerProfile');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/farmer-profile", farmerProfileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/seller-profile', sellerProfileRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("GreenBudget server is running 🚀");
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
