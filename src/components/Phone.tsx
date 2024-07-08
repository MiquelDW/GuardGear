// use 'cn' helper function to merge the default classNames with the given classNames send as a prop
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

// predefine object structure for the given 'props' object
// inherit all standard 'div' attributes like 'id', 'className', etc
// using 'interface' instead of 'type' in this context is often preferred because interface allows for declaration merging, which means you can extend or merge additional properties into the same interface later. This is useful for building more complex and extensible types in React components. However, both interface and type can often be used interchangeably in simpler cases.
// https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript
interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

// you can also extend 'type' using intersection types.
// Example: this combines properties from 'HTMLAttributes<HTMLDivElement>' with the given custom props to 'PhoneProps'
// type PhoneProps = HTMLAttributes<HTMLDivElement> & {
//   imgSrc: string;
//   dark?: boolean;
// };

// reusable component that displays a phonecase with a given phonecase-img
export default function Phone({
  imgSrc,
  className,
  dark = false,
  // collect all the other given props with the rest operator
  ...props
}: PhoneProps) {
  return (
    <div
      className={cn(
        // create new stacking context that stacks the child elements relative to the parent, not the default document flow.
        // without 'z-index: 50;' on the parent, the child elements will fall back to the default stacking context. Child elements with negative z-index values are placed behind other elements and disappear if they have no context and use the default stacking context.
        "pointer-events-none relative z-50 overflow-hidden",
        className,
      )}
      // spread out all the other given props in the <div> element
      {...props}
    >
      {/* phone case (z-50: shows on top of given phonecase-img) */}
      {/* NOTE: z-index only works only on elements that have a positioning other than the default 'static' (relative, absolute, sticky etc) */}
      {/* NOTE: positioned elements (with relative, absolute, fixed, or sticky) with a positive and negative z-index value are always placed above elements with default position: 'static' */}
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none"
        alt="phone image"
      />

      {/* image inside the phone case (-z-10: shows below phonecase) */}
      <div className="absolute inset-0 -z-10">
        <img
          src={imgSrc}
          className="min-h-full min-w-full object-cover"
          alt="overlaying phone image"
        />
      </div>
    </div>
  );
}
