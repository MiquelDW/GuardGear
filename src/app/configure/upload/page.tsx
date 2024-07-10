// indicate that this file or module should be treated as a Client Component
"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
// hook that allows you to upload images to a given endpoint
import { useUploadThing } from "@/lib/uploadthing";
// use 'cn' helper function to merge default classNames with other classNames
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// import 'DropZone' component to create a drag'n'drop zone for files
// also import type 'FileRejection' from the library
import DropZone, { type FileRejection } from "react-dropzone";

export default function Upload() {
  // the useToast hook returns a toast function that you can use to display the 'Toaster' component
  const { toast } = useToast();

  // instantiate 'router' object with the 'useRouter' hook
  const router = useRouter();

  // state that keeps track of if the user drags a file over the upload section
  // pass in a generic to tell TS what type the state variable will be
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // state variable that keeps track of the current upload progress
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // function that handles unvalid file drops
  // the dropped and rejected files are automatically provided by react-dropzone
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    // destructure rejected file obj from the given array 'rejectedFiles'
    const [file] = rejectedFiles;

    // user is no longer dragging an img over the dropzone if img was rejected
    setIsDragOver(false);

    // display the 'Toaster' component with an error message to the user
    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPG, or JPEG image instead",
      variant: "destructive",
    });
  };

  // function that handles valid file drops
  // the dropped and accepted files are automatically provided by react-dropzone
  const onDropAccepted = (acceptedFiles: File[]) => {
    // upload the dropped file via the end point / route "imageUploader"
    startUpload(acceptedFiles, { configId: undefined });

    // user is no longer dragging an img over the dropzone if img was accepted
    setIsDragOver(false);
  };

  // variable 'isUploading' keeps track of whether an upload has finished or not
  const { isUploading, startUpload } = useUploadThing("imageUploader", {
    // function that activates when the dropped image by the user has uploaded
    onClientUploadComplete: ([data]) => {
      // retrieve 'configId' from destructured 'data' that you get back from the route "imageUploader" after the image has been uploaded and added to DB
      const configId = data.serverData.configId;
      // navigate user to the next step and show loading state while the route's content is rendering
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    // function that keeps track of the current image upload progress
    onUploadProgress(p) {
      // update state var 'uploadProgress' with current retrieved upload progress
      setUploadProgress(p);
    },
  });

  // variable 'isPending' keeps track of whether a transition has finished or not
  // when navigating the user, you can show loading states while a page's content is rendering with the 'startTransition' function
  const [isPending, startTransition] = useTransition();

  // the vertical space is being handled using flex-1 tailwind class (use inspector mode to figure out the flex hierarchy structure)
  return (
    <div
      className={cn(
        "relative my-16 flex h-full w-full flex-1 flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl",
        // conditionally add these classnames if user drags a file over the upload section
        { "bg-blue-900/10 ring-blue-900/25": isDragOver },
      )}
    >
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        {/* drag'n'drop zone for files */}
        <DropZone
          // call function if user drops an unvalid file
          onDropRejected={onDropRejected}
          // call function if user drops an valid file
          onDropAccepted={onDropAccepted}
          // determine which files the 'DropZone' component accepts
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          // update state var if user drags a file inside or outside the 'DropZone' component
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {/* destructure the functions from the 'DropZone' component to make the drop functionality work */}
          {({ getRootProps, getInputProps }) => (
            <div
              className="flex h-full w-full flex-1 flex-col items-center justify-center"
              // spread in the props that the function 'getRootProps' returns
              {...getRootProps()}
            >
              {/* <input> element to drag images into */}
              <input
                // spread in the props that the function 'getInputProps' returns
                {...getInputProps()}
              />

              {/* Show icon to user */}
              {isDragOver ? (
                // user is currently dragging an file on the 'DropZone' component
                <MousePointerSquareDashed className="mb-2 h-6 w-6 text-zinc-500" />
              ) : isUploading || isPending ? (
                // user has dropped the img and it's currently being uploaded
                // user is being redirected to a different route, show loading state while the route's content is rendering
                <Loader2 className="mb-2 h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                // if nothing is happening (no dragging, no uploading, no loading), display default image icon
                <Image className="mb-2 h-6 w-6 text-zinc-500" />
              )}

              {/* Text to user */}
              <div className="mb-2 flex flex-col justify-center text-sm text-zinc-700">
                {isUploading ? (
                  // user has dropped the img and it's currently being uploaded
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      className="mt-2 h-2 w-40 bg-gray-300"
                      value={uploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  // img has been uploaded and the user is being redirected to the next step
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  // user is currently dragging an file on the 'DropZone' component
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  // if nothing is happening (no dragging, no uploading, no loading), display default message
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {/* Inform user which file formats are valid */}
              {isPending ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </DropZone>
      </div>
    </div>
  );
}
