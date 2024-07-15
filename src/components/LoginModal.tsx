import type { Dispatch, SetStateAction } from "react";
// "Dialog" component is an overlaying window
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
// The SDK ships with <LoginLink> and <RegisterLink> components which can be used to start the auth flow
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
// Next's 'Image' component optimizes images for performance. It automatically resizes, compresses, and serves images in the most appropriate format for the user's device
import Image from "next/image";
import { buttonVariants } from "./ui/button";

export default function LoginModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* holds the content to be rendered and displayed in the open dialog */}
      <DialogContent className="z-[9999999]">
        {/* header section of the dialog */}
        <DialogHeader>
          {/* snake image */}
          <div className="relative mx-auto mb-2 h-24 w-24">
            <Image
              fill
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
            />
          </div>

          {/* title to be announced when the dialog is opened */}
          <DialogTitle className="text-gray-90 text-center text-3xl font-bold tracking-tight">
            Log in to continue
          </DialogTitle>

          {/* description to be announced when the dialog is opened */}
          <DialogDescription className="py-2 text-center text-base">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        {/* Login + Register buttons */}
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
