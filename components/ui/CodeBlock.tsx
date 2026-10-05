import { cn } from "@/utils/cn";
import CopyButton from "./CopyButton";

type CodeBlockProps = {
  code: string;
  /** Shown in the header, e.g. "wp-config.php" or "Terminal". */
  title?: string;
  /** Language label for readers, e.g. "bash". No highlighting dependency is loaded. */
  language?: string;
  className?: string;
};

/**
 * Code block: a real <pre><code> in the initial HTML, keyboard-scrollable on overflow, with
 * a copy button as the only client JavaScript. Long lines scroll instead of wrapping.
 */
export default function CodeBlock({ code, title, language, className }: CodeBlockProps) {
  return (
    <figure className={cn("surface overflow-hidden !rounded-xl", className)}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-1.5">
        <span className="truncate text-xs font-semibold text-muted-foreground">
          {title ?? "Code"}
          {language && <span className="ms-2 font-mono font-normal text-subtle-foreground">{language}</span>}
        </span>
        <CopyButton text={code} />
      </figcaption>
      <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
