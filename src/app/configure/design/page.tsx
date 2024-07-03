import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

// predefine object structure for given 'props' object
interface DesignProps {
  // 'searchParams' prop contains dynamic query parameters from the current URL
  searchParams: {
    // use index signature to tell TS that the 'searchParams' object can have any number of properties, each with a key of type string
    // index signatures define the shape of an object
    [key: string]: string | string[] | undefined;
  };
}

export default async function Design({ searchParams }: DesignProps) {
  // destructure the dynamic query param 'id' from the given 'searchParams' obj
  const { id } = searchParams;

  // display 404 not found page if given dynamic query param 'id' is null or not valid
  if (!id || typeof id !== "string") {
    return notFound();
  }

  // use the DB client to read a single record from the table 'configuration'
  // find the 'configuration' object / record from the DB whose 'id' matches the given dynamic query param 'id'
  // the retrieved 'configuration' object / record holds data about the uploaded image by the user
  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  // display 404 not found page if no record has been read from the DB
  if (!configuration) {
    return notFound();
  }

  // retrieve the fields from the 'configuration' object / record you've read
  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      // pass in the props to correctly display the uploaded image by user
      configId={configuration.id}
      imageUrl={imageUrl}
      imageDimensions={{ width, height }}
    />
  );
}
