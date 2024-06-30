import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Phone from "@/components/Phone";
import Phones from "@/components/Phones";
// button variants from the component library
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
// navigate users to the specified routes without a full page reload
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
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
                <span className="bg-green-600 px-2 text-white">Custom</span>{" "}
                Phone Case
              </h1>

              {/* Description */}
              <p className="mt-8 max-w-prose text-balance text-center text-lg md:text-wrap lg:pr-10 lg:text-left">
                {/* max-w-prose sets the maximum width of an element to 65 characters (or 65ch), which is considered ideal for readability in typography. It's a comfortable measure for reading */}
                Capture your favorite memories with your own,{" "}
                <span className="font-semibold">one-of-one</span> phone case.
                CaseCobra allows you to protect your memories, not just your
                phone case.
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

      {/* Value Proposition Section */}
      <section className="bg-slate-100 py-24">
        {/* Wrapper */}
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
          {/* First Section Flex-Item wrapper & Flex container */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row">
            <h2 className="order-1 mt-2 text-balance text-center text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl">
              What our{" "}
              <span className="relative px-2">
                customers
                {/* create SVG icon (JSX element) */}
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
                  "I usually keep my phone together with my keys in my pocket
                  and that led to some pretty heavy scratchmarks on all of my
                  last phone cases. This one, besides a barely noticeable
                  scratch on the corner,{" "}
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

      {/* Bottom Section */}
      <section>
        {/* Wrapper */}
        <MaxWidthWrapper className="py-24">
          {/* Call To Action */}
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="order-1 mt-2 text-balance text-center text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl">
                Upload your photo and get{" "}
                <span className="relative bg-green-600 px-2 text-white">
                  your own case
                </span>{" "}
                now
              </h2>
            </div>
          </div>

          {/* Phone Case Example */}
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            {/* Flex & Grid container */}
            <div className="relative flex grid-cols-2 flex-col items-center gap-40 md:grid">
              {/* this image gets taken out the grid's & flex's flow */}
              <img
                src="/arrow.png"
                className="absolute left-1/2 top-[25rem] z-10 -translate-x-1/2 -translate-y-1/2 rotate-90 md:top-1/2 md:rotate-0"
              />

              <div className="relative h-80 w-full max-w-sm rounded-xl bg-gray-500/5 ring-inset ring-gray-900/10 md:h-full md:justify-self-end lg:rounded-2xl">
                <img
                  src="/horse.jpg"
                  className="h-full w-full rounded-md bg-white object-cover shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>

              <Phone className="w-60" imgSrc="/horse_phone.jpg" />
            </div>
          </div>

          {/* Highlights + Button to create phone case */}
          <ul className="mx-auto mt-12 w-fit max-w-prose space-y-2 sm:text-lg">
            <li className="w-fit">
              <Check className="mr-1.5 inline h-5 w-5 text-green-600" />
              High-quality silicone material
            </li>
            <li className="w-fit">
              <Check className="mr-1.5 inline h-5 w-5 text-green-600" />
              Scratch- and fingerprint resistant coating
            </li>
            <li className="w-fit">
              <Check className="mr-1.5 inline h-5 w-5 text-green-600" />
              Wireless charging compatible
            </li>
            <li className="w-fit">
              <Check className="mr-1.5 inline h-5 w-5 text-green-600" />
              Print warranty
            </li>

            <div className="flex justify-center">
              <Link
                href="/configure/payload"
                className={buttonVariants({
                  size: "lg",
                  className: "mx-auto mt-8",
                })}
              >
                Create your case now <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
