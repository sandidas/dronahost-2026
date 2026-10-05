import Link from "next/link";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary";
type Size    = "sm" | "md" | "lg" | "xl";

// md is the CSS default — no modifier class needed for it
const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  xl: "btn-xl",
};

interface ButtonProps {
  /** Navigation target — required because this renders as <Link> */
  href: string;
  variant?: Variant;
  size?: Size;
  /** Stretches the button to fill its container width */
  fullWidth?: boolean;
  /** Opens in a new tab and automatically adds rel="noopener noreferrer" */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  href,
  variant  = "primary",
  size     = "md",
  fullWidth = false,
  external  = false,
  className,
  children,
}: ButtonProps) {
  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        variant === "primary" ? "primary-btn" : "secondary-btn",
        sizeClass[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}
