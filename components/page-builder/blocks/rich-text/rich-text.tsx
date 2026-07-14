import ReactMarkdown, { type Components } from "react-markdown";
import type { RichTextProps } from "./rich-text.schema";

const WIDTH_CLASS: Record<RichTextProps["maxWidth"], string> = {
  narrow: "max-w-2xl",
  medium: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

/**
 * Custom Markdown renderers that lean on the project's Tailwind tokens —
 * we don't depend on @tailwindcss/typography (not in the v4 setup).
 * Raw HTML is deliberately not enabled (default react-markdown behaviour);
 * admin paste-ins can't smuggle scripts.
 */
const COMPONENTS: Components = {
  h1: ({ ...rest }) => (
    <h1
      className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-8 mb-4"
      {...rest}
    />
  ),
  h2: ({ ...rest }) => (
    <h2
      className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mt-7 mb-3"
      {...rest}
    />
  ),
  h3: ({ ...rest }) => (
    <h3 className="font-heading text-xl sm:text-2xl font-semibold mt-6 mb-2" {...rest} />
  ),
  p: ({ ...rest }) => (
    <p className="text-base leading-relaxed my-3 text-foreground/90" {...rest} />
  ),
  ul: ({ ...rest }) => (
    <ul className="list-disc pl-6 my-3 space-y-1" {...rest} />
  ),
  ol: ({ ...rest }) => (
    <ol className="list-decimal pl-6 my-3 space-y-1" {...rest} />
  ),
  li: ({ ...rest }) => <li className="leading-relaxed" {...rest} />,
  blockquote: ({ ...rest }) => (
    <blockquote
      className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4"
      {...rest}
    />
  ),
  code: ({ ...rest }) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
      {...rest}
    />
  ),
  hr: ({ ...rest }) => <hr className="my-6 border-border" {...rest} />,
  // Open external links in a new tab; keep internal as-is.
  a: ({ href, ...rest }) => {
    const isExternal =
      typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-primary hover:underline"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      />
    );
  },
};

export function RichTextView(props: RichTextProps) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className={`mx-auto ${WIDTH_CLASS[props.maxWidth]}`}>
        <ReactMarkdown components={COMPONENTS}>{props.body}</ReactMarkdown>
      </div>
    </section>
  );
}
