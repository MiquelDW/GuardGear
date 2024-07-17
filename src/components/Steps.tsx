// indicate that this file or module should be treated as a Client Component
"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// steps of creating a case
const STEPS = [
  {
    name: "Step 1: Add image",
    description: "Choose an image for your case",
    url: "/upload",
  },
  {
    name: "Step 2: Customize design",
    description: "Make the case yours",
    url: "/design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your final design",
    url: "/preview",
  },
];

export default function Steps() {
  // retrieve pathname from the current url
  const pathname = usePathname();

  return (
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
      {STEPS.map((step, i) => {
        // check if current step's url matches the current pathname
        const isCurrent = pathname.endsWith(step.url);

        // determine if the user has already completed the current step by checking if another step's url is currently active
        const isCompleted = STEPS.slice(i + 1).some(
          (step) => pathname.endsWith(step.url),

          /*
            Example 1st iteration:
            STEPS.slice(0 + 1) >> [obj2, obj3] (returns new array of steps 2 & 3)

            iterate over each element inside new array and check if atleast one of the step's url matches the current pathname:
            [obj2, obj3].some((step) => pathname.endsWith(step.url))
          */
        );

        // retrieve corresponding snake img for each step
        const imgPath = `/blue-shield-${i + 1}.png`;

        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1">
            <div>
              {/* underline for each step */}
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                  // use helper function 'cn' to conditionally add classnames
                  {
                    "bg-zinc-700": isCurrent,
                    "bg-primary": isCompleted,
                  },
                )}
                aria-hidden="true"
              />

              {/* step image */}
              <span
                className={cn(
                  i !== 0 && "lg:pl-9",
                  "flex items-center px-6 py-4 text-sm font-medium",
                )}
              >
                <span className="flex-shrink-0">
                  <img
                    src={imgPath}
                    className={cn(
                      "flex h-20 w-20 items-center justify-center object-contain",
                      {
                        "border-none": isCompleted,
                        "border-zinc-700": isCurrent,
                      },
                    )}
                  />
                </span>

                {/* step text */}
                <span className="ml-4 mt-0.5 flex h-full min-w-0 flex-col justify-center">
                  <span
                    className={cn("text-sm font-semibold text-zinc-700", {
                      "text-primary": isCompleted,
                      "text-zinc-700": isCurrent,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </span>

              {/* seperator */}
              {i !== 0 && (
                <div
                  className="absolute inset-0 hidden w-3 lg:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
