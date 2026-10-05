"use client";
import React from "react";
import clsx from "clsx";

interface LoaderWithTextProps {
  text?: string; // Optional loading text
  size?: "xs" | "sm" | "md" | "lg"; // Spinner size
  color?: string; // Tailwind color class (default: blue-600)
  fullScreen?: boolean; // Center on full screen
  inline?: boolean; // Inline loader for buttons or small UI
}

const LoaderWithText: React.FC<LoaderWithTextProps> = ({ text, size = "md", color = "border-blue-600", fullScreen = false, inline = false }) => {
  const sizeClasses = {
    xs: "h-2 w-2 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  const spinner = <div className={clsx("animate-spin rounded-full border-b-transparent", sizeClasses[size], color)} />;

  if (inline) {
    // For buttons, small UI
    return (
      <span className="flex items-center gap-2">
        {spinner}
        {text && <span className="text-sm ">{text}</span>}
      </span>
    );
  }

  if (fullScreen) {
    // Full page loader
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="mx-auto mb-4">{spinner}</div>
          {text && <p className="">{text}</p>}
        </div>
      </div>
    );
  }

  // Default (block loader for sections/cards/etc.)
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {spinner}
      {text && <p className="mt-2 ">{text}</p>}
    </div>
  );
};

export default LoaderWithText;
