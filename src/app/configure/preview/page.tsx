import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

// predefine object structure for given 'props' object
interface PreviewProps {
  // 'searchParams' prop contains dynamic query parameters from the current URL
  searchParams: {
    // design > page.tsx: has explanation about index signatures
    [key: string]: string | string[] | undefined;
  };
}

export default async function Preview({ searchParams }: PreviewProps) {
  // destructure the dynamic query param 'id' from the given 'searchParams' obj
  const { id } = searchParams;

  // display 404 not found page if given dynamic query param 'id' is null or not valid
  if (!id || typeof id !== "string") {
    return notFound();
  }

  // use the DB client to read a single record from the table 'configuration'
  // find the 'configuration' object / record from the DB whose 'id' matches the given dynamic query param 'id'
  // the retrieved 'configuration' object holds data about the uploaded image, the cropped image and chosen options for the phone case by the user (after step 2)
  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  // display 404 not found page if no record has been read from the DB
  if (!configuration) {
    return notFound();
  }

  return (
    <DesignPreview
      // pass in the retrieved record to correctly display the configured information by the user
      configuration={configuration}
    />
  );
}
