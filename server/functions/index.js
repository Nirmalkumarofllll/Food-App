const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
require('dotenv').config();
const cors = require("cors");

// Firebase credentials
const serviceAccountKey = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// Initialize Express app
const app = express();

// CORS configuration to allow requests only from your client domain
const corsOptions = {
  origin: 'https://nk-food-app.web.app',  // Allow requests only from this domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors(corsOptions));  // Apply CORS for all routes

// Body parser middleware for handling JSON data
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  return res.send('Hello World');
});

// Include your API route for users
const userRoute = require('./routes/user');
app.use("/api/users", userRoute);

// Include your API route for products
const productRoute = require("./routes/products");
app.use("/api/products", productRoute);

// Export the app as Firebase Function
exports.app = functions.https.onRequest(app);
