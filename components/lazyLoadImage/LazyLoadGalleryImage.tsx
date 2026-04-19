"use client";
import React, { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyLoadImageComp from "./LazyLoadImageComp";

interface IProps {
  images: IImage[];
  image: IImage;
}

const LazyLoadGalleryImage = ({ image, images }: IProps) => {
  const [active, setActive] = useState<IImage>(image);

  const currentIndex = images.findIndex((item) => item === active);
  // Get the item before the active item
  const prevItem = currentIndex > 0 ? images[currentIndex - 1] : null;

  // Get the item after the active item
  const nextItem = currentIndex < images.length - 1 ? images[currentIndex + 1] : null;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          onClick={() => {
            setActive(image);
          }}
          className="hover:opacity-70"
        >
          <span>
            <LazyLoadImageComp
              alt={image?.filename}
              src={image?.fileUrl?.imageUrl}
              className={"w-full"}
              width={900}
              height={800}
              // placeholder="blur"
              // blurDataURL={placeHolder}
            />
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent className="min-w-[100%]">
          <AlertDialogHeader>
            {/* <AlertDialogTitle>{active?.filename}</AlertDialogTitle> */}
            <AlertDialogDescription className="w-full">
              <span className="relative">
                {prevItem && (
                  <button
                    onClick={() => {
                      setActive(prevItem);
                    }}
                    className="absolute left-0 top-2/4 border rounded-full hover:bg-background  active:bg-primary active:text-title"
                  >
                    <ChevronLeft className="w-5 h-5 lg:w-14 lg:h-14" />
                  </button>
                )}

                <span className="flex w-full justify-center items-start">
                  <Image
                    alt={active?.filename}
                    src={active?.fileUrl?.imageUrl}
                    className={"max-h-[85dvh] w-fit"}
                    width={900}
                    height={800}
                    // placeholder="blur"
                    // blurDataURL={placeHolder}
                  />
                </span>

                {nextItem && (
                  <button
                    onClick={() => {
                      setActive(nextItem);
                    }}
                    className="absolute right-0 top-2/4 border rounded-full hover:bg-background active:bg-primary active:text-title"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-14 lg:h-14" />
                  </button>
                )}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction>Thank You</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LazyLoadGalleryImage;
