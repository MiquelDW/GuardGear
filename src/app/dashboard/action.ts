// action.ts module contains server-side logic RPC functions
// design > action.ts: has explanation about the purpose of action.ts file
"use server";

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";

export async function ChangeOrderStatus({
  orderId,
  newStatus,
}: {
  orderId: string;
  newStatus: OrderStatus;
}) {
  // update the 'status' field of a specific order entry
  await db.order.update({
    // update order entry whose 'id' matches the given 'orderId'
    where: { id: orderId },
    data: { status: newStatus },
  });
}
