import { Plus } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId, type ReactNode } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, Kicker, PrimaryAction, SCOPE } from "./BannerShell";
import Ticket from "./Ticket";

export type OfferPrice = {
  /** Already formatted with its symbol, from lib/pricing: "$9.99", or a CurrencyAmount. Never typed by hand. */
  amount: ReactNode;
  /** "/month billed annually". */
  period: string;
  /** Formatted renewal price, or a CurrencyAmount. Always shown when prices show. */
  renewal?: ReactNode;
  /** The one tax sentence from the project rules. */
  taxLine?: string;
};

/** Every text and the action are optional (the page builder requires nothing); what is empty is left out. */
export type OfferBannerProps = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  /** The name printed on the ticket: a plan or product family. */
  planName?: string;
  /** Omit while prices are hidden; the ticket then carries the action alone. */
  price?: OfferPrice;
  primaryCta?: { label: string; href: string };
  /** The risk reducer under the action, with the page that states its terms. Only while its claim renders. */
  riskReducer?: { text: string; href: string };
  /** One sentence on what happens after the click. */
  nextStep?: string;
  /** Verified, specific facts only. */
  highlights?: readonly string[];
  /** split = text beside an upright ticket · centered = text over a long ticket · compact = the whole banner is the ticket. */
  layout?: "split" | "centered" | "compact";
  /** ink = navy with the orange horizon light in both themes · page = follows the light or dark theme. */
  scope?: BannerScope;
  headingLevel?: "h1" | "h2";
  className?: string;
};

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 py-1.5">
      <dt className="t-meta text-muted-foreground">{label}</dt>
      <span aria-hidden="true" className="dotted-leader" />
      <dd className="tabular-nums text-sm text-foreground">{value}</dd>
    </div>
  );
}

/**
 * Transactional intent, banner 1, "ticket": everything a buyer checks before clicking, printed on a paper ticket. The
 * plan and price on the main part, renewal and tax as line items with dotted leaders, the action, the risk reducer and a
 * barcode on the stub. The navy band carries a low orange horizon, the only orange light on the site.
 */
export default function OfferBanner({ eyebrow, title, titleAccent, description, planName, price, primaryCta, riskReducer, nextStep, highlights, layout = "split", scope = "ink", headingLevel = "h1", className }: OfferBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const compact = layout === "compact";
  const centered = layout === "centered";
  const ink = scope === "ink";

  const heading = (title || titleAccent) && (
    <Heading id={headingId} className={cn(compact ? "t-statement-sm" : "t-statement", "text-foreground")}>
      {title}
      {titleAccent && (
        <>
          {" "}
          <span className="text-link">{titleAccent}</span>
        </>
      )}
    </Heading>
  );

  const priceBlock = price ? (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {/* The upright ticket is narrow, so a long amount ("AED 55.99") uses a smaller size there. */}
        <span className={cn("font-heading leading-none tracking-[-0.05em] text-foreground", compact || centered ? "text-6xl sm:text-7xl" : "text-5xl")}>{price.amount}</span>
        <span className="t-meta text-muted-foreground">{price.period}</span>
      </p>
      <dl className="mt-6">
        {price.renewal && <Row label={UI.banners.renewsAt} value={price.renewal} />}
      </dl>
      {price.taxLine && <p className="t-small mt-3 text-muted-foreground">{price.taxLine}</p>}
    </div>
  ) : (
    nextStep && (
      <p className="text-base leading-relaxed text-foreground">
        <span className="t-meta mb-2 block text-muted-foreground">{UI.banners.whatHappensNext}</span>
        {nextStep}
      </p>
    )
  );

  const ticketMain = (
    <div className="p-7 sm:p-9">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="t-meta text-link">{planName ?? eyebrow}</p>
        <span aria-hidden="true" className="t-meta text-muted-foreground">
          {UI.banners.plan}
        </span>
      </div>
      {compact && (
        <div className="mb-8">
          {heading}
          {description && <p className={cn("t-lead", heading && "mt-4")}>{description}</p>}
        </div>
      )}
      {priceBlock}
    </div>
  );

  const ticketStub = (
    <div className="flex h-full flex-col justify-between gap-6 p-7 sm:p-8">
      <div>
        {primaryCta && (
          <PrimaryAction href={primaryCta.href} className="w-full whitespace-normal text-center">
            {primaryCta.label}
          </PrimaryAction>
        )}
        {riskReducer && (
          <Link href={riskReducer.href} className="link-quiet t-small mt-3 inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground">
            {riskReducer.text}
          </Link>
        )}
        {price && nextStep && (
          <p className="t-small mt-2 text-muted-foreground">
            <span className="t-meta me-2 text-foreground">{UI.banners.whatHappensNext}</span>
            {nextStep}
          </p>
        )}
      </div>
      <span aria-hidden="true" className="barcode block h-9 w-full text-foreground opacity-70" />
    </div>
  );

  // ink keeps the navy band in both themes; page follows the theme, with a softer glow except on the compact ticket.
  const bg = ink ? "horizon-glow" : compact ? "bg-background" : "horizon-glow-soft";

  if (compact) {
    return (
      <BannerShell headingId={heading ? headingId : undefined} size="section" className={cn(SCOPE[scope], bg, className)}>
        <Ticket row main={ticketMain} stub={ticketStub} stubWidth="19rem" />
      </BannerShell>
    );
  }

  const intro = (
    <div className={cn("min-w-0", centered && "mx-auto max-w-4xl text-center")}>
      {eyebrow && (
        <Kicker center={centered} className="mb-7">
          {eyebrow}
        </Kicker>
      )}
      {heading}
      {description && <p className={cn("t-lead", heading && "mt-8", centered && "mx-auto")}>{description}</p>}
      {highlights && highlights.length > 0 && !centered && (
        <ul className="mt-10 space-y-3">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-base text-foreground">
              <Plus className="mt-1 size-4 shrink-0 text-link" aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <BannerShell headingId={heading ? headingId : undefined} className={cn(SCOPE[scope], bg, className)}>
      {centered ? (
        <>
          {intro}
          <Ticket row main={ticketMain} stub={ticketStub} stubWidth="19rem" className="mx-auto mt-14 max-w-4xl" />
        </>
      ) : (
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-20">
          {intro}
          <Ticket main={ticketMain} stub={ticketStub} className="mx-auto w-full max-w-sm transition-transform duration-500 lg:rotate-2 lg:hover:rotate-0" />
        </div>
      )}
    </BannerShell>
  );
}
