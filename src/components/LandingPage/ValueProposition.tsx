import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Icons } from "../Icons";
import { Check, Star } from "lucide-react";
import Phones from "../Phones";

export default function ValueProposition() {
  return (
    // Value Proposition Section
    <section className="bg-slate-100 py-24">
      {/* Wrapper */}
      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
        {/* First Section Flex-Item wrapper & Flex container */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row">
          <h2 className="order-1 mt-2 text-balance text-center text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl">
            What our{" "}
            <span className="relative px-2">
              customers
              {/* create SVG icon ('underline' prop returns JSX element) */}
              <Icons.underline className="pointer-events-none absolute inset-x-0 -bottom-6 hidden text-green-500 sm:block" />
            </span>{" "}
            say
          </h2>
          <img
            src="/snake-2.png"
            className="order-0 w-24 select-none lg:order-2"
          />
        </div>

        {/* Second Section Flex-Item wrapper & Grid container */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* First Grid-Item wrapper & Flex container (first user review) */}
          <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
            {/* Stars / Rating */}
            <div className="mb-2 flex gap-0.5">
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
            </div>

            {/* Review Text */}
            <div className="text-lg leading-8">
              <p>
                "The case feels durable and I even got a compliment on the
                design. Had the case for two and a half months now and{" "}
                <span className="bg-slate-800 p-0.5 text-white">
                  the image is super clean
                </span>
                , on the case I had before, the image started fading into
                yellow-ish color after a couple weeks. Love it."
              </p>
            </div>

            {/* Reviewer */}
            <div className="mt-2 flex gap-4">
              <img
                src="/users/user-1.png"
                className="h-12 w-12 rounded-full object-cover"
                alt="user"
              />
              <div className="flex flex-col">
                <p className="font-semibold">Jonathan</p>
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-green-600" />
                  <p className="text-sm">Verified Purchase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Grid-Item wrapper (second user review) */}
          <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
            {/* Stars / Rating */}
            <div className="mb-2 flex gap-0.5">
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
            </div>

            {/* Review Text */}
            <div className="text-lg leading-8">
              <p>
                "I usually keep my phone together with my keys in my pocket and
                that led to some pretty heavy scratchmarks on all of my last
                phone cases. This one, besides a barely noticeable scratch on
                the corner,{" "}
                <span className="bg-slate-800 p-0.5 text-white">
                  looks brand new after about half a year
                </span>
                . I dig it."
              </p>
            </div>

            {/* Reviewer */}
            <div className="mt-2 flex gap-4">
              <img
                src="/users/user-4.jpg"
                className="h-12 w-12 rounded-full object-cover"
                alt="user"
              />
              <div className="flex flex-col">
                <p className="font-semibold">Miquel</p>
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-green-600" />
                  <p className="text-sm">Verified Purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* entire phone grid animation */}
      <div className="pt-16">
        <Phones />
      </div>
    </section>
  );
}
