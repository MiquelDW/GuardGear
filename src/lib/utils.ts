// clsx is a utility for constructing className strings conditionally. It takes in various arguments (which can be strings, objects, arrays, etc.) and combines them into a single string of class names
// clsx(inputs): Combines the class names from 'inputs' into a single string
import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

// this function allows you to merge classnames
export function cn(...inputs: ClassValue[]) {
  // twMerge ensures that later classes in the list take precedence over the earlier ones when there are tailwind classname conflicts
  return twMerge(clsx(inputs));
}

// function to format numbers to USD prices
export function formatPrice(num: number) {
  // create formatter object that formats numbers as USD
  const formatter = new Intl.NumberFormat("en-US", {
    // settings for currency
    style: "currency",
    currency: "USD",
  });

  // return formatted version of given 'num'
  return formatter.format(num);
}

// function that returns Metadata for your application
// set a default value of an empty object for the destructured parameter (= {})
export function constructMetadata({
  title = "GuardGear - custom high-quality phone cases",
  description = "Create custom high-quality phone cases in seconds",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    // enhances how the app appears when shared on social media
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    // enhances how the app appears when shared on Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@miqueldewit",
    },
    // icons metadata
    icons,
    // specify root URL that will be used as the base for constructing absolute URLs in your metadata
    metadataBase: new URL("https://guardgear.vercel.app/"),
  };
}
