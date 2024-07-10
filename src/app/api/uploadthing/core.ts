import { createUploadthing, type FileRouter } from "uploadthing/next";
// 'zod' library is a TS schema declaration and validation library that allows you to pass in any object at runtime and then parse it to make sure its the type you expect
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // this route will run once an image has been uploaded by the user
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // define schema where 'configId' is an optional string property
    // .input() receives user input in the defined shape / schema
    .input(z.object({ configId: z.string().optional() }))
    // pass in the received 'input' from the user to the middleware
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // destructure the given 'input' from the middleware inside obj 'metadata'
      const { configId } = metadata.input;

      // fetch the uploaded image from 'uploadThings'
      const res = await fetch(file.url);
      // convert response data from 'res' into a low-level representation of binary data (arrayBuffer)
      // use this when working with image, audio, or other non-textual data. It allows you to work with raw binary data in a buffer format
      const buffer = await res.arrayBuffer();

      // load the uploaded image inside the buffer using the 'sharp' function
      // extract and return metadata about the uploaded image from the returned sharp instance
      const imgMetadata = await sharp(buffer).metadata();
      // destructure the width and height from the uploaded image metadata
      const { height, width } = imgMetadata;

      // if no 'configId' is passed into this route, then you're on step 1
      // this will only activate for step 1, since there will be no 'configId' given and available when an user uploads an image
      if (!configId) {
        // use the DB client to add new data to the table 'configuration'
        const configuration = await db.configuration.create({
          data: {
            // new record generates unique 'configId' on its own
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        });

        // return the 'config ID' from the newly added 'configuration' object
        // this will be returned to 'onClientUploadComplete'
        return { configId: configuration.id };
      } else {
        // if 'configId' already exists and is passed to the route, that means you want to update an existing 'configuration' object in the DB (step 2)
        const updatedConfiguration = await db.configuration.update({
          where: {
            // update the record where its 'id' matches the given 'configId'
            id: configId,
          },
          data: {
            // update the value of the field 'croppedImageUrl' with the url from the given uploaded cropped image
            croppedImageUrl: file.url,
          },
        });

        // return the 'config ID' from the updated 'configuration' object
        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
