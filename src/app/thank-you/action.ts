// action.ts module contains server-side logic RPC functions
// design > action.ts: has explanation about the purpose of action.ts file
"use server";

import { db } from "@/db";
// in Server Components you can get the Kinde Auth data by using the getKindeServerSession helper
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// checks if user is logged in and checks payment status of user's order
export async function getPaymentStatus({ orderId }: { orderId: string }) {
  // the getUser() function reads the cookies attached to that API request and returns the currently logged-in user
  const { getUser } = getKindeServerSession();
  // the 'user' object contains the currently logged-in user from the current session
  const user = await getUser();

  // throw error if user data has not been found
  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  // retrieve the order from the logged-in user
  const order = await db.order.findFirst({
    // grab order entry from DB whose 'id' & 'userId' matches the given 'orderId' and 'user.id' by Stripe and Kinde
    where: { id: orderId, userId: user.id },
    // also fetch the related records of the retrieved order entry (SQL join syntax)
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      User: true,
    },
  });

  // throw error if the order doesn't exist
  if (!order) throw new Error("This order does not exist");

  // return the retrieved order entry with the related records if the order has been paid by the user
  if (order.isPaid) {
    return order;
  } else {
    throw new Error("Payment not yet received");
  }
}
