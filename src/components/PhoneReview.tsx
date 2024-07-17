// indicate that this file or module should be treated as a Client Component
"use client";

import { CaseColor } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "@/lib/utils";

export default function PhoneReview({
  croppedImageUrl,
  color,
}: {
  croppedImageUrl: string;
  color: CaseColor;
}) {
  // ref object that points to phoneCase <div> container
  const phoneCaseRef = useRef<HTMLDivElement>(null);

  // state variable that keeps track of the dimensions of phoneCase <div> container
  // (initial) rendered dimensions of the phoneCase <div> container is dependent on how large the user's browser window currently is
  // and the (initial) rendered dimensions and position of the cropped image is dependent on how large the phoneCase <div> container currently is
  const [renderedDimensions, setRenderedDimensions] = useState({
    height: 0,
    width: 0,
  });

  function handleResize() {
    // exit function if ref object doesn't refer to phoneCase <div> container
    if (!phoneCaseRef.current) return;
    // retrieve current dimensions of the phoneCase <div> container
    const { width, height } = phoneCaseRef.current.getBoundingClientRect();
    // update the state variable that keeps track of the dimensions of container
    setRenderedDimensions({ width, height });
  }

  useEffect(() => {
    // callback function to retrieve current size of phoneCase <div> container
    handleResize();

    // add event listener to the that calls the callback function whenever the window is resized (whenever resize event occurs)
    window.addEventListener("resize", handleResize);

    // clean-up function that runs before every re-execution of the useEffect or when the component unmounts
    // avoids memory leaks that could lead to unexepected behaviour
    return () => window.removeEventListener("resize", handleResize);
  }, [phoneCaseRef.current]);

  // determine which case background color to use
  let caseBackgroundColor = "bg-zinc-950";
  if (color === "blue") caseBackgroundColor = "bg-blue-950";
  if (color === "rose") caseBackgroundColor = "bg-rose-950";

  // in order for the phone case to maintain its aspect ratio, use 'AspectRatio' Component from UI lib
  return (
    <AspectRatio ref={phoneCaseRef} ratio={3000 / 2001} className="relative">
      {/* cropped image */}
      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          // calc positions based on the current dimensions of the phoneCase <div> container
          left:
            renderedDimensions.width / 2 -
            renderedDimensions.width / (1216 / 121),

          top: renderedDimensions.height / 6.22,
        }}
      >
        <img
          // calc width of cropped image based on current width of the phoneCase <div> container
          width={renderedDimensions.width / (3000 / 637)}
          className={cn(
            "phone-skew relative z-20 rounded-b-[10px] rounded-t-[15px] md:rounded-b-[20px] md:rounded-t-[30px]",
            caseBackgroundColor,
          )}
          src={croppedImageUrl}
        />
      </div>

      {/* girl holding phone */}
      <div className="relative z-40 h-full w-full">
        <img
          alt="phone"
          src="/clearphone.png"
          className="pointer-events-none h-full w-full rounded-md antialiased"
        />
      </div>
    </AspectRatio>
  );
}
