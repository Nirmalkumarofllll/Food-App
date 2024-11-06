const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
require('dotenv').config();

const serviceAccountKey = require('./serviceAccountKey.json');

const express = require("express");
const app = express();

// Body parser for our JSON data
app.use(express.json());

// Cross-origin resource sharing (CORS)
const cors = require("cors");
app.use(cors({ origin: true }));
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});
const cors = require('cors');
app.use(cors({
  origin: 'https://nk-food-app.web.app', // Allow only Firebase domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

// API endpoints
app.get("/", (req, res) => {
    return res.send('hello world');
});

// User routes
const userRoute = require('./routes/user');
app.use("/api/users", userRoute);  

const productRoute = require("./routes/products");
app.use("/api/products/", productRoute);

// Export the app
exports.app = functions.https.onRequest(app);
