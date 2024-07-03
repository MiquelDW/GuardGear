// indicate that this file or module should be treated as a Client Component
"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
// NextImage component in Next.js optimizes images for performance. It automatically resizes, compresses, and serves images in the most appropriate format for the user's device (it also avoids a naming conflict in this module)
import NextImage from "next/image";

// predefine object structure for the given 'props' object
interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  return (
    <div className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
      {/*  */}
      <div className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        {/*  */}
        {/* 896/1831 is the aspect ratio of the phone where you place the img */}
        <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
          {/* in order for the phone case to maintain its aspect ratio, use 'AspectRatio' Component from UI lib */}
          <AspectRatio
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            {/* phone case */}
            <NextImage
              // image will fill the available width & height of parent container
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>

          {/*  */}
          <div className="" />

          {/*  */}
          <div className={cn("")} />
        </div>

        {/*  */}
        <div>Rnd Component react-rnd lib</div>
      </div>

      {/*  */}
      <div className="">
        {/*  */}
        <div>ScrollArea from UI lib</div>

        {/*  */}
        <div className=""></div>
      </div>
    </div>
  );
}
