
require("dotenv").config();
var keys = require("./keys.js");
var Stripe = keys.Stripe;
const keyPublishable = Stripe.PUBLISHABLE_KEY;
const keySecret = Stripe.SECRET_KEY;


const express = require("express");
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");
var path = require("path");


const app = express();
var PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/charge", function(req, res) {
  res.sendFile(path.join(__dirname, "public/charge.html"));
});

app.post("/charge", (req, res) => {
  let amount = 500;

  stripe.customers.create({
    email: req.body.email,
    card: req.body.id
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .then(charge => {
    console.log("successful payment");
    res.send(charge)
  })
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
