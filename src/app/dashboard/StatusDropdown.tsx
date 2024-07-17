// indicate that this file or module should be treated as a Client Component
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
// "DesignConfigurator.tsx" has explanation on this hook
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsDownUp } from "lucide-react";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { ChangeOrderStatus } from "./action";

// object that maps given 'orderStatus' to the corresponding order status label
// 'Record' is a utility type that constructs an object type with a set of properties 'K' of type 'T'
// the keys are of type 'OrderStatus', the values of those keys are of type 'string'
const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

// function component that displays current order status and updates order status
export default function StatusDropdown({
  orderId,
  // default value will be "awaiting_shipment"
  orderStatus,
}: {
  orderId: string;
  orderStatus: OrderStatus;
}) {
  const router = useRouter();

  // destructure defined mutation function
  const { mutate } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["change-order-status"],
    // define mutation function that updates order status
    mutationFn: ChangeOrderStatus,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  return (
    // display dropdown menu to the user
    <DropdownMenu>
      {/* button that triggers the dropdown menu */}
      <DropdownMenuTrigger
        // change the default rendered element to the one passed as a child, merging their props and behavior
        asChild
      >
        <Button
          variant="outline"
          className="flex w-52 items-center justify-between"
        >
          {/* display currently active order status */}
          {LABEL_MAP[orderStatus]}
          <ChevronsDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      {/* this component pops out when the dropdown menu is triggered */}
      <DropdownMenuContent className="p-0">
        {/* display all order status options (map through enum 'OrderStatus') */}
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
              {
                // add classname if current 'status' is equal to given 'orderStatus' (from DB)
                "bg-zinc-100": status === orderStatus,
              },
            )}
            onClick={() =>
              mutate({ orderId, newStatus: status as OrderStatus })
            }
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                // conditionally add classname based on whether current order 'status' is active or not
                status === orderStatus ? "opacity-100" : "opacity-0",
              )}
            />

            {/* display current order 'status' option */}
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
