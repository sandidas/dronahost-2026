import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";
/** `xl` is a deprecated alias of `lg`, kept so existing usages keep compiling. */
type Size = "sm" | "md" | "lg" | "xl";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  xl: "btn-lg",
};

type CommonProps = {
  /** primary = the single orange action per section. Default "primary". */
  variant?: Variant;
  /** sm 40px (44px hit area) · md 48px · lg 56px. Default "md". */
  size?: Size;
  /** Stretches the button to fill its container width. */
  fullWidth?: boolean;
  /** Shows a spinner, sets aria-busy and blocks interaction. */
  loading?: boolean;
  /** Blocks interaction and dims the button. */
  disabled?: boolean;
  /** Icon rendered before the label. Decorative: give it aria-hidden. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label. Decorative: give it aria-hidden. */
  trailingIcon?: React.ReactNode;
  /** Longer accessible name. Must start with or contain the visible label (WCAG 2.5.3). */
  "aria-label"?: string;
  className?: string;
  children: React.ReactNode;
};

type LinkButtonProps = CommonProps & {
  /** Navigation target. Renders a crawlable <a> via next/link. */
  href: string;
  /** Opens in a new tab and adds rel="noopener noreferrer". */
  external?: boolean;
  type?: never;
  onClick?: never;
};

type ActionButtonProps = CommonProps & {
  href?: undefined;
  external?: never;
  /** Native button type. Default "button". */
  type?: "button" | "submit" | "reset";
  /** Only usable from a Client Component parent. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type ButtonProps = LinkButtonProps | ActionButtonProps;

/**
 * Button. Renders `<a>` (next/link) when `href` is set, otherwise `<button>`.
 *
 * @example
 * <Button href="/pricing">View plans</Button>
 * <Button variant="secondary" size="lg" href="/contact">Talk to an expert</Button>
 * <Button type="submit" loading={pending}>Send message</Button>
 */
export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
  } = props;

  const classes = cn("btn", variantClass[variant], sizeClass[size], fullWidth && "btn-block", className);
  const blocked = disabled || loading;

  const content = (
    <>
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={classes}
        aria-label={props["aria-label"]}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        tabIndex={blocked ? -1 : undefined}
        {...(props.external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      disabled={blocked}
      aria-label={props["aria-label"]}
      aria-busy={loading || undefined}
      onClick={props.onClick}
    >
      {content}
    </button>
  );
}

export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
