"use client";
import dynamic from "next/dynamic";
const LoaderWithText = dynamic(() => import("./LoaderWithText"), { ssr: false });

interface LoadingOverlayProps {
  show: boolean;
}

export default function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm rounded-2xl">
      <LoaderWithText text="Processing..." />
    </div>
  );
}
// HOW TO USE THIS
// <LoadingOverlay show={state.loading.submit} />
