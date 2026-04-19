import { cn } from "@/utils/cn";

type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function Button({
  variant = "primary",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={cn(
        variant === "primary" ? "primary-btn" : "secondary-btn",
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="btn-spinner mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="sr-only">Loading</span>
          <span aria-hidden="true">Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
