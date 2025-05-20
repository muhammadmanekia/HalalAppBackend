const stripe = require("stripe")(process.env.STRIPE_API_KEY); // Replace with your Stripe secret key

const PaymentInfo = require("../models/PaymentInfo"); // Import the PaymentInfo model

exports.sendPayment = async (req, res) => {
  const { amount, cart } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    console.log(paymentIntent.client_secret);

    // Save the payment info in MongoDB if paymentIntent.client_secret succeeds
    const paymentData = new PaymentInfo({
      amount: amount,
      clientSecret: paymentIntent.client_secret,
      cart: cart, // Save additional info from the body
    });

    await paymentData.save(); // Save to MongoDB

    res.send({ paymentIntent: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
