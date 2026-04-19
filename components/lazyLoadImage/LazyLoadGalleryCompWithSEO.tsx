import React from "react";
import Image from "next/image";
import LazyLoadGalleryImageWithSwiper from "./LazyLoadGalleryImageWithSwiper";

interface IProps {
  images: IImage[];
}

const LazyLoadGalleryCompWithSEO = ({ images = [] }: IProps) => {
  return (
    <div className="columns-1 lg:columns-2">
      {images.length > 0 &&
        images.map((image, index) => (
          <div key={index} className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] group hover:cursor-pointer w-full pb-5">
            <LazyLoadGalleryImageWithSwiper image={image} images={images} />
          </div>
        ))}
      <noscript>
        {images.length > 0 &&
          images.map((image, index) => (
            <div key={index}>
              <Image src={`${image?.fileUrl?.imageUrl}`} alt={image?.filename} key={index} width={200} height={200} />
            </div>
          ))}
      </noscript>
    </div>
  );
};

export default LazyLoadGalleryCompWithSEO;
