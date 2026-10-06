import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/content/company";

/**
 * Floating WhatsApp link. Renders nothing until a verified number is set in `content/company.ts`.
 * A plain wa.me link, so no third-party script loads and no consent is needed. Sits above the
 * sticky mobile CTA on small screens.
 */
export default function WhatsAppButton({ number = COMPANY.whatsappNumber }: { number?: string | null }) {
  const digits = number?.replace(/\D/g, "") ?? "";
  if (digits.length < 7) return null;
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed end-4 bottom-24 z-30 inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong bg-card px-4 text-sm font-medium text-foreground shadow-lg hover:bg-muted md:bottom-6"
    >
      <MessageCircle className="size-5 text-secondary" aria-hidden="true" />
      <span className="max-sm:sr-only">Chat on WhatsApp</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
