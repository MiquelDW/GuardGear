// use 'cn' helper function to merge the default classNames with the given classNames send as a prop
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// reusable wrapper component that creates consistent padding, width etc on elements across the application
export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto h-full w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
