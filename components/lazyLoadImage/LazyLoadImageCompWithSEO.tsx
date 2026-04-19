import Image from "next/image";
import LazyLoadImageCompSkeleton from "./LazyLoadImageCompSkeleton";

interface IProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const LazyLoadImageCompWithSEO = ({
  src,
  alt,
  className,
  width = 600,
  height = 400,
  priority,
  sizes,
}: IProps) => {
  return (
    <>
      <LazyLoadImageCompSkeleton
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
      />

      {/* Fallback for crawlers / JS-disabled browsers */}
      <noscript>
        <Image
          className={className || "h-full w-full"}
          src={src}
          width={width}
          height={height}
          alt={alt}
        />
      </noscript>
    </>
  );
};

export default LazyLoadImageCompWithSEO;
