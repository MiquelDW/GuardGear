// Route Handlers allows you to create highly customized and dynamic API endpoints within your Next.js application that handles client requests

import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

// create new instance of the Resend client using the Resend API key
// this instance can be used to interact with the Resend API to send emails to users
const resend = new Resend(process.env.RESEND_API_KEY);

// POST request handler for this webhook API endpoint - POST is the standard HTTP method for sending data to a server (webhook API endpoint), which aligns with the purpose of webhooks--transmitting event information from Stripe to your application
// every route handler function receives two arguments when a client sends an HTTP request to an API endpoint: the 'request' object and the 'context' object
export async function POST(req: Request) {
  try {
    // read the incoming request body as a string
    const body = await req.text();
    // fetch the value of the "stripe-signature" header from the request
    // this signature is generated using a combination of the payload (the request body) and your webhook secret
    const signature = headers().get("stripe-signature");

    // return error HTTP Response if value of signature header is empty
    if (!signature) {
      // status of response object is: 400 bad request
      return new Response("Invalid signature", { status: 400 });
    }

    // the 'constructEvent' function uses the webhook secret key to recreate the signature from the received payload / body. It then compares this recreated signature to the one provided in the stripe-signature header
    // verifies that the request is made by Stripe and not by a random user
    // if any user can make the request to this API, they can get phone cases for free! We don't want that
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // check if the Checkout Session has been successfully completed by the user
    if (event.type === "checkout.session.completed") {
      // throw error if user's email is missing after checkout session has been completed
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      // retrieve the completed payment checkout session data
      const session = event.data.object as Stripe.Checkout.Session;

      // destructure metadata object from the completed payment checkout session
      // this is the metadata that you constructed in "preview > action.ts"
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      // throw error if destructured metadata is not null
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      // retrieve the billing address and shipping address of the user from the completed payment checkout session
      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      // update an existing 'order' object in the DB (table Order)
      const updatedOrder = await db.order.update({
        // update the record where its 'id' matches the given 'orderId' (from the metadata of the completed payment checkout session)
        where: {
          id: orderId,
        },
        data: {
          // you've checked that the request to the webhook endpoint is from Stripe
          // this means that Stripe has processed the payment and you've received the money (the user has paid via Stripe)
          isPaid: true,
          // create new shipping- and billing address entries that should be linked to the updated order entry (with FK's)
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            },
          },
        },
      });

      // send an order-received email to the user after the payment processing is done
      await resend.emails.send({
        // center of the email, verify your email in <> to send emails from a custom email
        from: "GuardGear <onboarding@resend.dev>",
        // send email to the user's email
        to: ["delivered@resend.dev"],
        // to: [event.data.object.customer_details.email],
        subject: "Thanks for your order!",
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          // @ts-ignore
          shippingAddress: {
            // passing obj 'shippingAddress' with the following props is fine
            name: session.customer_details!.name!,
            city: shippingAddress!.city!,
            country: shippingAddress!.country!,
            postalCode: shippingAddress!.postal_code!,
            street: shippingAddress!.line1!,
            state: shippingAddress!.state,
          },
        }),
      });

      // return HTTP response object that contains the completed Checkout Session
      return NextResponse.json({ result: event, ok: true });
    }
  } catch (err) {
    // runs if Webhook signature verification failed for example...
    console.error(err); // appears in runtime logs wherever you deploy this app

    // you can also optionally send the error to an error logging tool that helps to debug (such as 'sentry'), at jobs and enterprise products it's common to do that

    // if anything went wrong, return error HTTP Response with status: 500 Internal Server Error
    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    );
  }
}
