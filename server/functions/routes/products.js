const router = require('express').Router();
const admin = require("firebase-admin");
const db = admin.firestore();
db.settings({ignoreUndefinedProperties : true});
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/create", async (req,res) => {
    try{
        const id=Date.now();
        const data = {
            productId : id,
            product_name : req.body.product_name,
            product_category : req.body.product_category,
            product_price : req.body.product_price,
            imageURL : req.body.imageURL,
          };
          const response = await db.collection("products").doc(`/${id}/`).set(data);
          console.log(response)
          return res.status(200).send({success : true, data : response});
    }catch(err){
        return res.send({success: false, msg: `Error :${err}`})
    };
});

//getall the products
router.get("/all", async (req, res) => {
  (async () =>{
    try{
      let query = db.collection("products");
      let response = [];
      await query.get().then(querysnap =>{
        let docs = querysnap.docs;
        docs.map(doc => {
          response.push({...doc.data()})
        });
        return response;
      });
      return res.status(200).send({success : true, data : response});
    }catch(err){
      return res.send({success : false, msg: `Error : ${err}`});
    }
  })();
});

//delete a product
router.delete("/delete/:productId", async (req, res) => {
  const productId = req.params.productId;
  try{
    await db.collection("products").doc(`/${productId}/`).delete().then(result => {
      return res.status(200).send({success : true, data : result});
    })
  }catch(err){
    return res.send({success : false, msg: `Error : ${err}`});
  }
});
 //create a cart
 router.post("/addToCart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();

    if (doc.data()) {
      const quantity = doc.data().quantity + 1;
      const updatedItem = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .update({ quantity });
      return res.status(200).send({ success: true, data: updatedItem });
    } else {
      const data = {
        productId: productId,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        product_price: req.body.product_price,
        imageURL: req.body.imageURL,
        quantity: 1,
      };
      const addItems = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .set(data);
      return res.status(200).send({ success: true, data: addItems });
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error :${err}` });
  }
});

//get all the cartitems for that user
router.get("/getCartItems/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  (async () => {
    try {
      let query = db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items");
      let response = [];

      await query.get().then((querysnap) => {
        let docs = querysnap.docs;

        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (er) {
      return res.send({ success: false, msg: `Error :,${er}` });
    }
  })();
});

// update cart to increase and decrease the quantity
router.post("/updateCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId = req.query.productId;
  const type = req.query.type;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();

    if (doc.data()) {
      if (type === "increment") {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        if (doc.data().quantity === 1) {
          await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const quantity = doc.data().quantity - 1;
          const updatedItem = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error :${err}` });
  }
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Checkout session creation and order placement
router.post("/create-checkout-session", async (req, res) => {
  const data = req.body.data;

  const options = {
    amount: data.total * 100, 
    currency: "INR",
    receipt: "receipt#1", 
    notes: {
      user_id: data.user.user_id,
      cart: JSON.stringify(data.cart),
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    await createOrder(data.user, order, data);
    res.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Order in DB
const createOrder = async (customer, razorpayOrder, data) => {
  console.log("Inside the orders");
  try {
    const orderId = Date.now();
    const orderData = {
      intentId: razorpayOrder.id,
      orderId: orderId,
      amount: razorpayOrder.amount,
      created: Date.now(),
      payment_method_types: razorpayOrder.method,
      status: "paid", // Assuming the payment was successful
      customer: customer,
      items: data.cart,
      total: data.total,
      sts: "preparing",
    };

    await db.collection("orders").doc(`${orderId}`).set(orderData);
    await deleteCart(customer.user_id);
    console.log("Order created and cart cleared.");
  } catch (err) {
    console.log("Error in order creation:", err);
    throw new Error("Order creation failed");
  }
};

// Clear Cart
const deleteCart = async (userId) => {
  try {
    const cartRef = db.collection("cartItems").doc(userId).collection("items");
    const cartItems = await cartRef.get();

    if (!cartItems.empty) {
      const batch = db.batch();
      cartItems.forEach((item) => {
        batch.delete(cartRef.doc(item.id));
      });
      await batch.commit();
      console.log("Cart items deleted for user:", userId);
    }
  } catch (err) {
    console.log("Error deleting cart:", err);
  }
};


router.get("/orders", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("orders");
      let response = [];
      await query.get().then((querysnap) => {
        let docs = querysnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error :${err}` });
    }
  })();
});

// Fetch Orders 
/*
router.get("/orders", async (req, res) => {
  try {
    const query = db.collection("orders");
    const snapshot = await query.get();
    const response = snapshot.docs.map(doc => doc.data());
    
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.status(500).send({ success: false, msg: `Error: ${err}` });
  }
});*/

// update the order status
router.post("/updateOrder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const sts = req.query.sts;

  try {
    const updatedItem = await db
      .collection("orders")
      .doc(`/${order_id}/`)
      .update({ sts });
    return res.status(200).send({ success: true, data: updatedItem });
  } catch (er) {
    return res.send({ success: false, msg: `Error :,${er}` });
  }
});

// update the order status
router.post("/updateOrder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const sts = req.query.sts;

  try {
    const updatedItem = await db
      .collection("orders")
      .doc(`/${order_id}/`)
      .update({ sts });
    return res.status(200).send({ success: true, data: updatedItem });
  } catch (er) {
    return res.send({ success: false, msg: `Error :,${er}` });
  }
});8

module.exports = router;