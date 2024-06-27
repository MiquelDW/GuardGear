// navigate users to the specified routes without a full page reload
import Link from "next/link";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  // variable that determines if current user is logged in
  const user = undefined;

  // variable that determines if current logged in user is an admin
  const isAdmin = false;

  return (
    <nav
      className="sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all"
      aria-label="Primary site navigation"
    >
      <MaxWidthWrapper>
        <div className="border-zinc-20 flex h-14 items-center justify-between border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            case <span className="text-green-600">cobra</span>
          </Link>
          <div className="flex h-full items-center space-x-4">
            {/* show links based on login status of the current user */}
            {user ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign out
                </Link>
                {/* show link if current logged in user is an admin */}
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                  >
                    Dashboard ✨
                  </Link>
                )}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center sm:flex",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign up
                </Link>
                <Link
                  href="/api/auth/login"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Login
                </Link>

                <div className="hidden h-8 w-px bg-zinc-200 sm:block" />

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center sm:flex",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
