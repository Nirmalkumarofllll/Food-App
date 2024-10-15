const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();
const serviceAccountKey = require("./serviceAccountKey.json");
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

app.get("/", (req, res) => {
  return res.send("hello world");
});

const userRoute = require("./routes/user");
const productRoute = require("./routes/products");

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

module.exports = app;
