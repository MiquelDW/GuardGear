// action.ts module contains server-side logic RPC functions
// design > action.ts: has explanation about the purpose of action.ts file
"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
// in Server Components you can get the Kinde Auth data by using the getKindeServerSession helper
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

// RPC function that creates a payment session for the current user
export async function createCheckoutSession({
  configId,
}: {
  configId: string;
}) {
  // find the 'configuration' object / record from the DB whose 'id' matches the given argument 'configId'
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  // throw custom error if no record has been read from the DB
  if (!configuration) throw new Error("No such configuration found");

  // the getUser() function reads the cookies attached to that API request and returns the currently logged-in user
  const { getUser } = getKindeServerSession();
  // the 'user' object contains the currently logged-in user from the current session
  const user = await getUser();

  // throw custom error if user is not logged in
  if (!user) throw new Error("You need to be logged in");

  // destructure configured "finish" and "material" options by the user
  const { finish, material } = configuration;

  // calc the total price of the configured phone case by the user
  // you don't want to receive the total price from the client, because the user can change and manipulate the total price client-side
  let totalPrice = BASE_PRICE;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;

  // check in the DB if user already ordered a specific configuration
  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  // "order" object that keeps track of the user's order
  let order: Order | undefined = undefined;
  if (existingOrder) {
    // assign the existing order object to the "order" object
    order = existingOrder;
  } else {
    // create new order object in the DB and assign it to the "order" object
    order = await db.order.create({
      data: {
        amount: totalPrice / 100,
        // assign appropriate values to the foreign keys
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  // tell stripe what product the user is buying
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      // configure price formatting and data
      currency: "USD",
      unit_amount: totalPrice,
    },
  });

  // create payment session with the product the user is buying
  const stripeSession = await stripe.checkout.sessions.create({
    // redirect user to the specified route if payment was successful
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    // redirect user to the specified route if payment was cancelled by user
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    // configure payment methods
    payment_method_types: ["card", "paypal"],
    // configure the type of the checkout session (payment, subscription etc)
    mode: "payment",
    // configure allowed countries to ship orders to
    shipping_address_collection: { allowed_countries: ["DE", "US", "NL"] },
    // configure metadata about the payment session that you receive after a payment was successful to know which user paid and which order needs to be shipped
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    // configure what the customer is purchasing
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  // return an object with an "url" prop containing the url to the checkout page hosted by Stripe
  // if user is navigated to this url, the configured payment session starts
  return { url: stripeSession.url };
}
