// TODO: This component references LazyLoadGalleryImage which has missing dependencies.
// It is not used anywhere in the active codebase.
// Commenting out for now to fix build issues.

import React from "react";
import Image from "next/image";
import { IImage } from "@/lib/types";

interface IProps {
  images: IImage[];
}

const LazyLoadGalleryCompWithSEO = ({ images = [] }: IProps) => {
  return (
    <div className="columns-1 lg:columns-2">
      {/* <noscript> */}
      {images.length > 0 &&
        images.map((image, index) => (
          <div key={index} className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] group hover:cursor-pointer w-full pb-5">
            <Image src={`${image?.fileUrl?.imageUrl}`} alt={image?.filename} key={index} width={200} height={200} />
          </div>
        ))}
      {/* </noscript> */}
    </div>
  );
};

export default LazyLoadGalleryCompWithSEO;
