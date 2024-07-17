// indicate that this file or module should be treated as a Client Component
"use client";

import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/option.validator";
import { Configuration } from "@prisma/client";
// "DesignConfigurator.tsx" has explanation on this hook
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./action";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/components/ui/use-toast";
// in Client Components you can get the Kinde Auth Data using the useKindeBrowserClient helper
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoginModal from "@/components/LoginModal";

export default function DesignPreview({
  configuration,
}: {
  configuration: Configuration;
}) {
  const router = useRouter();
  const { toast } = useToast();
  // destructure the 'id' from the configured phone case by the user
  const { id } = configuration;
  // retrieve the currently logged-in user
  const { user } = useKindeBrowserClient();
  console.log(user);

  // state var that determines if the Login Modal component should be displayed
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // state var that determines if the confetti animation should be displayed
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => {
    // set state var 'showConfetti' to "true" when component is mounted
    setShowConfetti(true);
  }, []);

  // destructure configured options by the user
  const { color, model, finish, material } = configuration;

  // find the color-object the user has selected for the phone case
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color,
  )?.tw;

  // find the model-object the user has selected for the phone case
  // destructure 'label' (renamed to modelLabel) from the found model-object
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model,
  )!;

  // calc the total price of the configured phone case by the user
  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  // destructure defined mutation function (renamed to 'createPaymentSession')
  const { mutate: createPaymentSession, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["get-checkout-session"],
    // define mutation async function that creates a payment session
    mutationFn: async () => await createCheckoutSession({ configId: id }),
    // fire this func if mutation function has successfully completed
    onSuccess: ({ url }) => {
      // if returned 'url' from mutation function exists, navigate user to that url to start the payment session
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
    // fire this func if an error occurs during execution of mutation function
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  // callback function that creates a payment session for the current user
  function handleCheckout() {
    if (user) {
      // create payment session
      createPaymentSession();
    } else {
      // user needs to log in first before starting a payment session
      // store configured phone case from previous steps inside the user's browser local storage
      localStorage.setItem("configurationId", id);
      // display Login Modal component by updating state var to true
      setIsLoginModalOpen(true);
    }
  }

  return (
    <>
      {/* Confetti to the user after completing steps 1 & 2 */}
      <div
        // hide this <div> from screen readers
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      {/* LoginModal where user can login */}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      {/*  Grid Container */}
      <div className="mt-20 flex flex-col items-center text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
        {/* Grid-Item Wrapper - Configured phone case */}
        <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
          <Phone
            className={cn("max-w-[150px] md:max-w-full", `bg-${tw}`)}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        {/* Grid-Item Wrapper - Header */}
        <div className="mt-6 md:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" /> In stock and ready to
            ship
          </div>
        </div>

        {/* Grid-Item Wrapper - Summary + Checkout button */}
        <div className="text-base md:col-span-9">
          {/* highlights + materials (grid-container) */}
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            {/* grid-item wrapper */}
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>

            {/* grid-item wrapper */}
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          {/* prices + checkout button */}
          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                {/* display if user has chosen "textured" finish */}
                {finish === "textured" && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                )}

                {/* display if user has chosen "polycarbonate" material */}
                {material === "polycarbonate" && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                )}

                {/* seperator */}
                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
                // 'isPending' keeps track of whether the mutation function is currently running
                disabled={isPending}
                isLoading={isPending}
                loadingText="Redirecting"
                onClick={() => handleCheckout()}
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
