// indicate that this file or module should be treated as a Client Component
"use client";

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
// Next 'Image' component optimizes images for performance. It automatically resizes, compresses, and serves images in the most appropriate format for the user's device (it also avoids a naming conflict in this module)
import NextImage from "next/image";
// 'Rnd' is a draggable and resizable React Component from the 'react-rnd' lib
import { Rnd } from "react-rnd";
// component to create Radio Group from 'headlessui' lib
import {
  Field,
  Radio,
  RadioGroup,
  Label as LabelHeadless,
  Description,
} from "@headlessui/react";
import { useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option.validator";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/components/ui/use-toast";
// useMutation hook is typically used to create/update/delete data or perform server side-effects
// with this hook, you're able to perform server-side operations and seperate it from the client, while also being able to perform client side actions based on the result of those operations (such as redirecting the user if mutation function has successfully completed), among other main benefits of this hook
import { useMutation } from "@tanstack/react-query";
// rename 'saveConfig' to '_saveConfig' to prevent naming conflict
import { SaveConfigArgs, saveConfig as _saveConfig } from "./action";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";

// predefine object structure for the given 'props' object
interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  const router = useRouter();
  const { toast } = useToast();

  // destructure defined mutation function (renamed to 'saveConfig') and the provided 'isPending'
  const { mutate: saveConfig, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["save-config"],
    // define mutation async function
    mutationFn: async (args: SaveConfigArgs) => {
      // save the user's configuration in DB (these promises run in parallel)
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    // fire this func if an error occurs during execution of mutation function
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    // fire this func if mutation function has successfully completed
    onSuccess: () => {
      // navigate user to the next step
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  // usestate hook to keep track of the currently selected options
  const [options, setOptions] = useState<{
    // define type of each object prop (typeof 'array' indexed with a number)
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  // state variable that keeps track of the dimensions of cropped image
  const [renderedDimension, setRenderedDimension] = useState({
    // start out with these dimensions
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  // state variable that keeps track of the position of cropped image
  const [renderedPosition, setRenderedPosition] = useState({
    // start out with these positions
    x: 150,
    y: 205,
  });

  // ref objects that point to grid-item container & phoneCase container <div> elements
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneCaseRef = useRef<HTMLDivElement>(null);

  // upload the cropped img file via the end point / route "imageUploader"
  const { startUpload } = useUploadThing("imageUploader");

  // function that uploads the cropped image to 'uploadThings' and updates DB
  async function saveConfiguration() {
    try {
      // retrieve grid-item container coordinates
      const {
        // destructured props renamed to 'containerLeft' & 'containerTop'
        // 'left' and 'top' is the distance from the edge of the page to the container in px (offset)
        left: containerLeft,
        top: containerTop,
      } = containerRef.current!.getBoundingClientRect();

      // retrieve phone case container coordinates and dimensions
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      // calculate the left and top offset of the phonecase from the grid-item <div> container
      // C:\Users\mique\OneDrive\Afbeeldingen\Schermopnamen\Calc_Offset.png
      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      // calc the actual x & y positions of cropped image by removing the calced offsets from the current x & y positions (also offsets) of the dragged and resized (cropped) image
      // so, you get the position of the (cropped) image relative to the phone case
      // C:\Users\mique\OneDrive\Afbeeldingen\Schermopnamen\calc_cropped_positition_improved.png
      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      // create a canvas element on which to draw the cropped image
      const canvas = document.createElement("canvas");
      // canvas has the same dimensions as the phone case
      canvas.width = width;
      canvas.height = height;
      // context object allows you to modify the created canvas element
      const context = canvas.getContext("2d");

      // instantiate image object that holds the given uploaded image ('imageUrl')
      const userImage = new Image();
      // prevent cross-origin errors when retrieving image from the given src ('imageUrl')
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      // wait until the given uploaded image has successfully been loaded in
      await new Promise((resolve) => (userImage.onload = resolve));

      // with the information about the position and dimensions of the cropped image on the phone case, you can draw the cropped image on the canvas
      context?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
      );

      // convert canvas HTML into base64-encoded string representing the image (url)
      const base64 = canvas.toDataURL();
      // retrieve the image data part of the base64 string url
      const base64Data = base64.split(",")[1];

      // convert base64 string url into blob object (Binary Large Object) that represents the HTML canvas element (phone case with cropped image)
      const blob = base64ToBlob(base64Data, "image/png");
      // convert blob object into an file element that you can upload
      const file = new File([blob], "filename.png", { type: "image/png" });

      // upload canvas with cropped image .png file via the specified route, and also pass in the given 'configId'
      // update the record in the DB where its 'id' matches the given 'configId'
      await startUpload([file], { configId });
    } catch (err) {
      // display the 'Toaster' component with an error message to the user
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  }

  // function that converts base64 string url into an image
  function base64ToBlob(base64: string, mimeType: string) {
    // convert base64 string url into individual bytes
    const byteCharacters = atob(base64);
    // convert bytes into numbers and put them inside an array (of length 3065)
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // convert byte numbers into Uint8Array
    const byteArray = new Uint8Array(byteNumbers);
    // convert Uint8Array into a blob element and pass in the given 'mimeType''
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
      {/* Grid-Item wrapper - Design Phone Case (Left Section) */}
      <div
        ref={containerRef}
        className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {/* Wrapper for the phone case */}
        {/* 896/1831 is the aspect ratio of the phone where you place the img */}
        <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
          {/* in order for the phone case to maintain its aspect ratio, use 'AspectRatio' Component from UI lib */}
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            {/* phone case */}
            <NextImage
              // image will fill the available width & height of parent container
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>

          {/* background to cover the entire Grid-Item wrapper using shadow (wrapper has overflow-hidden, so the shadow from this child <div> isn't visible beyond the wrapper) */}
          <div className="absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-40 rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />

          {/* color of the case */}
          <div
            className={cn(
              "absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]",
              // use "tw" color prop from the current selected 'color' for bg
              `bg-${options.color.tw}`,
            )}
          />
        </div>

        {/* 'Rnd' is a draggable and resizable React Component */}
        <Rnd
          // define image's starting position & starting dimensions
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          // lock the aspect ratio based on the given initial dimensions
          lockAspectRatio
          // pass in custom React component as the resize handle
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          // execute callback function when resizing of the component stops
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            // update dimensions inside the state var with the current dimensions of cropped image
            setRenderedDimension({
              // slice 'px' away from 'height' and 'width' values
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            // update x & y positions inside the state var with the current x & y positions of cropped image
            setRenderedPosition({ x, y });
          }}
          // execute callback function when dragging of the component stops
          onDragStop={(_, data) => {
            // destructure current x & y positions of cropped image
            const { x, y } = data;

            // update x & y positions inside the state var with the current x & y positions of cropped image
            setRenderedPosition({ x, y });
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="relative h-full w-full">
            <NextImage
              src={imageUrl}
              // image will fill the available width & height of parent container
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      {/* Grid-Item wrapper - Select Options (Right Section) */}
      <div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
        {/* Scroll Area where user chooses from given configuration options */}
        <ScrollArea className="relative flex-1 overflow-auto">
          {/* fade in effect to make scroll area look better */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
          />

          {/* options for the user */}
          <div className="px-8 pb-12 pt-8">
            {/* scroll area title */}
            <h2 className="text-3xl font-bold tracking-tight">
              Customize your case
            </h2>

            {/* seperator */}
            <div aria-hidden="true" className="my-6 h-px w-full bg-zinc-200" />

            {/* options user can choose from */}
            <div className="relative mt-4 flex h-full flex-col justify-between">
              <div className="flex flex-col gap-6">
                {/* color options */}
                <RadioGroup
                  // set current selected radio button based on the current selected color
                  value={options.color}
                  // activate event and run callback when new option is selected
                  onChange={(val) => {
                    // update obj 'color' in state var 'options' with given current selected color
                    setOptions((prev) => ({ ...prev, color: val }));
                  }}
                >
                  {/* display currently selected color */}
                  <Label>Color: {options.color.label}</Label>

                  {/* display all color options */}
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Field key={color.label}>
                        <Radio
                          // set value of the radio-btn to the given 'color' obj (used to check if radio-btn is checked)
                          value={color}
                          // the 'checked' status of radiobutton is provided
                          className={({ checked }) =>
                            cn(
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0",
                              // conditionally add classname to the current radiobutton based on its current 'checked' status
                              {
                                [`border-${color.tw}`]: checked,
                              },
                            )
                          }
                        >
                          <span
                            className={cn(
                              `bg-${color.tw}`,
                              "h-8 w-8 rounded-full border border-black border-opacity-10",
                            )}
                          />
                        </Radio>
                      </Field>
                    ))}
                  </div>
                </RadioGroup>

                {/* model options */}
                <div className="relative flex w-full flex-col gap-3">
                  <Label>Model</Label>
                  {/* display dropdown menu ot the user */}
                  <DropdownMenu>
                    {/* button that triggers the dropdown menu */}
                    <DropdownMenuTrigger
                      // the 'DropdownMenuTrigger' component renders as the 'Button' component because of the asChild prop. This allows the 'Button' to inherit all the styles and behaviors of the 'DropdownMenuTrigger' while functioning as the 'Button' component.
                      asChild
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    {/* this component pops out when the dropdown menu is triggered */}
                    <DropdownMenuContent>
                      {/* display all models */}
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100",
                            // conditionally add classname to the current Dropdown menu item if its 'label' is equal to the 'label' of the currently selected model
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            },
                          )}
                          // activate event and run callback when new model is clicked
                          onClick={() => {
                            // update obj 'model' in state var 'options' with given current selected model
                            setOptions((prev) => ({ ...prev, model: model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              // conditionally add classname based on if current Dropdown menu item's 'label' is equal to the 'label' of the currently selected model
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* material & finish options */}
                {/* create a seperate <RadioGroup> component instance for each object inside the array '[MATERIALS, FINISHES]' */}
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      // use bracket notation to dynamically access property
                      // set current selected radio button based on the current selected 'options[name]'
                      value={options[name]}
                      // activate event and run callback when new option is selected
                      onChange={(val) => {
                        // update '[name]' in state var 'options' with given current selected value (material or finish option)
                        setOptions((prev) => {
                          // console.log(name);
                          // console.log([name]);
                          return { ...prev, [name]: val };
                        });
                      }}
                    >
                      <Label>
                        {/* make the first letter uppercase */}
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>

                      {/* display all material & finish options */}
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Field key={option.value}>
                            <Radio
                              // set value of the radio-btn to the given 'option' obj (used to check if radio-btn is checked)
                              value={option}
                              className={({ checked }) =>
                                cn(
                                  "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                                  // conditionally add classname to the current radiobutton based on its current 'checked' status
                                  {
                                    "border-primary": checked,
                                  },
                                )
                              }
                            >
                              {/* radio button label + description */}
                              <span className="flex items-center">
                                <span className="flex flex-col text-sm">
                                  <LabelHeadless
                                    className="font-medium text-gray-900"
                                    as="span"
                                  >
                                    {option.label}
                                  </LabelHeadless>

                                  {/* radio button description */}
                                  {option.description && (
                                    <Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block sm:inline">
                                        {option.description}
                                      </span>
                                    </Description>
                                  )}
                                </span>
                              </span>

                              {/* radio button price description */}
                              <Description
                                as="span"
                                className="sm:ml4 mt-2 flex text-sm sm:mt-0 sm:flex-col sm:text-right"
                              >
                                <span className="font-medium text-gray-900">
                                  {formatPrice(option.price / 100)}
                                </span>
                              </Description>
                            </Radio>
                          </Field>
                        ))}
                      </div>
                    </RadioGroup>
                  ),
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* bottom section after configuring design */}
        <div className="h-16 w-full bg-white px-8">
          {/* seperator */}
          <div className="h-px w-full bg-zinc-200" />

          {/* price + continue button */}
          <div className="flex h-full w-full items-center justify-end">
            <div className="flex w-full items-center gap-6">
              {/* display current total price to the user */}
              <p className="whitespace-nowrap font-medium">
                {/* calculate price based on base price, current selected finish option & current selected material option */}
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100,
                )}
              </p>

              {/* continue button to take user to the next step */}
              <Button
                size="sm"
                className="w-full"
                // call the mutation function to save the cropped image and the chosen options for phonecase by the user in the remote DB, and redirect user to step 3
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    model: options.model.value,
                    material: options.material.value,
                    finish: options.finish.value,
                  })
                }
                // 'isPending' keeps track of whether the mutation function is currently running
                disabled={isPending}
                isLoading={isPending}
                loadingText="Saving"
              >
                Continue
                <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
