// indicate that this file or module should be treated as a Client Component
"use client";

// this hook is used for fetching and caching data from a server
// use this hook when you want to fetch data that is primarily read-only, such as getting a list of items, details of a single item, etc
// "DesignConfigurator.tsx" has explanation on the server-side benefits
import { useQuery } from "@tanstack/react-query";
// in non-page components, (dynamic) query parameters are not passed as a prop
// use the 'useSearchParams' hook to access the dynamic query parameters from the current URL
import { useSearchParams } from "next/navigation";
import { getPaymentStatus } from "./action";
import { Loader2 } from "lucide-react";
import PhoneReview from "@/components/PhoneReview";
import { formatPrice } from "@/lib/utils";

export default function ThankYouPage() {
  // retrieve the (dynamic) query parameter(s) from the current URL
  const searchParams = useSearchParams();
  // retrieve the value of the dynamic query parameter "orderId"
  const orderId = searchParams.get("orderId") || "";

  // destructure returned data from the query function
  const { data, error } = useQuery({
    // queryKey is useful for caching and invalidation
    queryKey: ["get-payment-status"],
    // checks payment status of user's order
    queryFn: async () => await getPaymentStatus({ orderId }),
    // keep retrying the query function if it throws an error
    // it's important to retrieve the order from the user and its current status
    retry: true,
    retryDelay: 500,
  });

  // display loading state if the order entry from the query function hasn't been returned yet (still fetching from DB)
  if (data === undefined) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  // display "not paid" state if the order entry from the query function hasn't been paid yet (waiting for the Webhook to update DB).
  // Stripe checkout window doesn't close when the payment has been received, it closes before that.
  // the request to the Webhook endpoint is send at the same time as the user exits the Stripe checkout page, they run in parallel.
  if (error) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  // retrieve and display the order data from the given order entry (data) if it has been paid by the user (the Webhook has updated the DB)
  const { configuration, billingAddress, shippingAddress, amount } = data;
  const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Thank you section */}
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>

          <div className="mt-10 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        {/* Last words to user */}
        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at GuardGear believe that a phone case doesn't only need to
              look good, but also last you for the years to come. We offer a
              5-year print guarantee: If your case isn't of the highest quality,
              we'll replace it for free.
            </p>
          </div>
        </div>

        {/* Phone review for the user */}
        <div className="mt-4 flex space-x-6 overflow-hidden rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhoneReview
            croppedImageUrl={configuration.croppedImageUrl!}
            color={color!}
          />
        </div>

        {/* Shipping and Billing addresses + Payment status and Shipping method */}
        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{billingAddress?.name}</span>
                  <span className="block">{billingAddress?.street}</span>
                  <span className="block">
                    {billingAddress?.postalCode} {billingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        {/* Prices */}
        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-semibold text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
