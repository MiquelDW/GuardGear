import Stripe from "stripe";

// create new instance of the Stripe client using the Stripe API key
// this instance can be used to interact with the Stripe API for various payment services and operations in your application
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  // configure the client instance
  apiVersion: "2024-06-20",
  typescript: true,
});
