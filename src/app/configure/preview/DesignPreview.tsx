// indicate that this file or module should be treated as a Client Component
"use client";

import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Configuration } from "@prisma/client";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

export default function DesignPreview({
  configuration,
}: {
  configuration: Configuration;
}) {
  // state variable that determines if the confetti animation should be shown
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => {
    // set state var 'showConfetti' to "true" when component is mounted
    setShowConfetti(true);
  }, []);

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

      {/* LoginModal */}
      <div></div>

      {/*  Grid Container */}
      <div className="mt-20 flex flex-col items-center text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
        {/* Grid-Item Wrapper - Configured phone case */}
        <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
          <Phone
            className={cn("max-w-[150px] md:max-w-full")}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        {/* Grid-Item Wrapper - Header */}
        <div className="mt-6 md:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" /> In stock and ready to
            ship
          </div>
        </div>

        {/* Grid-Item Wrapper - Summary + Checkout button */}
        <div className="text-base md:col-span-9">
          {/* highlights + materials */}
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          {/* prices + checkout button */}
          <div className="mt-8 flex flex-col">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">20</p>
                </div>

                {/* seperator */}
                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">150</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button className="px-4 sm:px-6 lg:px-8">
                Check out <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
