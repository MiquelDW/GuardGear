import React from "react";

import { Check, Star } from "lucide-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Phone from "@/components/Phone";

export default function HeroSection() {
  return (
    // Hero Section
    <section>
      {/* Hero Section Wrapper */}
      <MaxWidthWrapper className="pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-3 lg:gap-x-0 lg:pb-52 lg:pt-24 xl:gap-x-8 xl:pt-32">
        {/* First Section Grid-Item wrapper (spans 2 cols) */}
        <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
          {/* Flex container First Section */}
          <div className="relative mx-auto flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Snake Picture */}
            <div className="absolute -top-20 left-0 hidden w-28 lg:block">
              {/* gradient goes from bottom to top, start color begins with slate-50 and transitions to slate-50 at 50% opacity in the middle of the gradient */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 via-slate-50/50" />
              <img src="/snake-1.png" className="w-full select-none" />
            </div>

            {/* Title */}
            <h1 className="relative mt-16 w-fit text-balance text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Your Image on a{" "}
              <span className="bg-green-600 px-2 text-white">Custom</span> Phone
              Case
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-prose text-balance text-center text-lg md:text-wrap lg:pr-10 lg:text-left">
              {/* max-w-prose sets the maximum width of an element to 65 characters (or 65ch), which is considered ideal for readability in typography. It's a comfortable measure for reading */}
              Capture your favorite memories with your own,{" "}
              <span className="font-semibold">one-of-one</span> phone case.
              GuardGear allows you to protect your memories, not just your phone
              case.
            </p>

            {/* Highlights */}
            <ul className="mt-8 flex flex-col items-center space-y-2 text-left font-medium sm:items-start">
              <div className="space-y-2">
                <li className="flex items-center gap-1.5 text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  High-quality, durable material
                </li>
                <li className="flex items-center gap-1.5 text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />5 year
                  print guarantee
                </li>
                <li className="flex items-center gap-1.5 text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Modern iPhone models supported
                </li>
              </div>
            </ul>

            {/* Happy customers */}
            <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              {/* images */}
              <div className="flex -space-x-4">
                {/* 'Image' component from Next uses lazy loading to optimize site performance, which is very handy but can also look pretty horrendous in some scenarios. The normal html image sometimes looks better */}
                <img
                  src="/users/user-1.png"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                  alt="user image"
                />
                <img
                  src="/users/user-2.png"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                  alt="user image"
                />
                <img
                  src="/users/user-3.png"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                  alt="user image"
                />
                <img
                  src="/users/user-4.jpg"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                  alt="user image"
                />
                <img
                  src="/users/user-5.jpg"
                  // when resizing, make the image cover its container without distorting its aspect ratio, even if it means cropping some parts of the image
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                  alt="user image"
                />
              </div>

              {/* stars + some text */}
              <div className="flex flex-col items-center justify-between sm:items-start">
                <div className="flex gap-0.5">
                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                </div>

                <p>
                  <span className="font-semibold">1.250</span> happy customers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section Grid-Item wrapper (spans 1 col or all columns) & Flex container */}
        <div className="col-span-full mt-32 flex h-fit w-full justify-center px-8 sm:px-16 md:px-0 lg:col-span-1 lg:mx-0 lg:mt-20">
          <div className="relative md:max-w-xl">
            <img
              // hide this image from screen readers
              aria-hidden="true"
              src="/your-image.png"
              className="absolute -top-20 left-56 hidden w-40 select-none sm:block lg:hidden lg:w-52 xl:block"
            />
            <img
              // hide this image from screen readers
              aria-hidden="true"
              src="/line.png"
              className="absolute -bottom-6 -left-6 w-20 select-none"
            />

            {/* this component also creates the space that allows the absolutely positioned <img> elements to show */}
            <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
