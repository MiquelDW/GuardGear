import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Phone from "@/components/Phone";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

// button variants from the component library
// navigate users to the specified routes without a full page reload
import Link from "next/link";

export default function CallToAction() {
  return (
    // Call-To-Action Section
    <section>
      {/* Wrapper */}
      <MaxWidthWrapper className="py-24">
        {/* Call To Action */}
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-balance text-center text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl">
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
            <Check className="mr-1.5 inline h-5 w-5 text-green-600" />5 year
            print warranty
          </li>

          <div className="flex justify-center">
            <Link
              href="/configure/upload"
              // apply tailwind classes from the button componnent
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
  );
}
