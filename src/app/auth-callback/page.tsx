// indicate that this file or module should be treated as a Client Component
"use client";

// this hook is used for fetching and caching data from a server
// use this hook when you want to fetch data that is primarily read-only, such as getting a list of items, details of a single item, etc
// "DesignConfigurator.tsx" has explanation on the server-side benefits
import { useQuery } from "@tanstack/react-query";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./action";
import { Loader2 } from "lucide-react";

// An "auth callback page" is a designated page that handles the response from an authentication provider, such as Kinde, after a user logs in or signs up.
// This response typically includes authentication tokens or error messages.
// An "auth callback page" is just a fancy name for a "redirect page" after user has logged in or signed up.

// this page searches for a "configuration ID" and redirects the user to the "preview" route if a config ID is found.
// this page is also able to add signed up users to the DB, and redirect them accordingly. Users that login won't get added again to the DB, and will also be redirected accordingly
export default function Page() {
  const router = useRouter();
  // state variable that stores the current configId from browser's local storage
  const [configId, setConfigId] = useState<string | null>(null);

  // on mount, retrieve and store current configId from browser's local storage
  useEffect(() => {
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) setConfigId(configurationId);
  }, []);

  // destructure returned data from the query function
  const { data } = useQuery({
    // queryKey is useful for caching and invalidation
    queryKey: ["auth-callback"],
    // query function checks if user is logged in and adds user to the DB if it doesn't exist there yet
    queryFn: async () => await getAuthStatus(),
    // keep retrying the query function if it throws an error
    // it's important for the app to check if user is logged in and exists in DB
    retry: true,
    retryDelay: 500,
  });

  // run code if the user is logged in and has been added to the DB (or not)
  if (data?.success) {
    // if configId from browser's local storage has been found
    if (configId) {
      // remove the configId from local storage
      localStorage.removeItem("configurationId");
      // push the user back it's phone case configuration
      router.push(`/configure/preview?id=${configId}`);
    } else {
      // if NO configId from browser's local storage has been found
      router.push("/");
    }
  }

  // return some user feedback while they're on the auth callback page
  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="text-xl font-semibold">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
