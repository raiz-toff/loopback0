"use client";

import * as React from "react";
import { Children, isValidElement } from "react";
import { DownloadIcon, FileCodeIcon, WrapTextIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/tooltip";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block";

// MDX `pre` replacement for docs and blog. fumadocs-mdx highlights with Shiki
// at build time and hands this component the <code> element (one `.line`
// span per line, `highlighted` / `diff add|remove` / `focused` classes from
// the meta string) plus `title`, `icon` (SVG markup) and the line-number
// flags. The `shiki` class on the root keeps fumadocs' shiki.css rules
// (token colours in both themes, highlighted-line tint, counters) in force.

type MdxPreProps = React.ComponentProps<"pre"> & {
  title?: string;
  icon?: string | React.ReactNode;
  "data-line-numbers"?: boolean;
  "data-line-numbers-start"?: number;
  /** Fence language, added by the `portfolio:lang` transformer in source.config.ts. */
  "data-lang"?: string;
};

/** Line numbers switch on by themselves once a block is long enough to need them. */
const AUTO_NUMBER_FROM = 6;

function countLines(children: React.ReactNode): number {
  let count = 0;
  Children.forEach(children, (child) => {
    if (!isValidElement<{ children?: React.ReactNode }>(child)) return;
    if (child.type === "code") {
      count += countLines(child.props.children);
    } else {
      count += 1;
    }
  });
  return count;
}

function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function MdxCodeBlock({
  title,
  icon,
  className,
  children,
  "data-line-numbers": lineNumbersProp,
  "data-line-numbers-start": startLine = 1,
  "data-lang": lang,
  ...props
}: MdxPreProps) {
  const [wrap, setWrap] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const lineCount = React.useMemo(() => countLines(children), [children]);
  const lineNumbers = lineNumbersProp ?? lineCount >= AUTO_NUMBER_FROM;

  const readText = () => preRef.current?.innerText.replace(/\n$/, "") ?? "";
  const filename = title && /\.[a-z0-9]+$/i.test(title) ? title.split("/").pop()! : "snippet.txt";

  return (
    <CodeBlock
      className={cn("shiki not-prose my-5", className)}
      data-line-numbers={lineNumbers || undefined}
      style={{ counterReset: `line ${startLine - 1}` } as React.CSSProperties}
    >
      <CodeBlockHeader>
        <CodeBlockTitle>
          {typeof icon === "string" ? (
            <span
              aria-hidden
              className="inline-flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-full"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : (
            (icon ?? <FileCodeIcon aria-hidden />)
          )}
          <span className="truncate">{title ?? lang ?? "Code"}</span>
        </CodeBlockTitle>
        <CodeBlockActions>
          <Tooltip label={wrap ? "Unwrap lines" : "Wrap lines"} side="bottom" align="end">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Toggle line wrap"
              aria-pressed={wrap}
              className="aria-pressed:bg-muted aria-pressed:text-foreground"
              onClick={() => setWrap((v) => !v)}
            >
              <WrapTextIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Download" side="bottom" align="end">
            <Button variant="ghost" size="icon-xs" aria-label="Download code" onClick={() => download(readText(), filename)}>
              <DownloadIcon />
            </Button>
          </Tooltip>
          <CodeBlockCopyButton value={readText} />
        </CodeBlockActions>
      </CodeBlockHeader>

      <div
        data-slot="code-block-content"
        tabIndex={0}
        className={cn(
          "min-w-0 overflow-x-auto overscroll-x-contain py-3 text-[13px] leading-relaxed outline-none",
          wrap && "overflow-x-hidden"
        )}
      >
        <pre
          ref={preRef}
          data-wrap={wrap || undefined}
          className={cn(
            // Each `.line` is a flex row so highlights span the full width
            // even when the block scrolls horizontally.
            "min-w-full w-max font-mono *:flex *:flex-col",
            wrap && "w-full [&_.line]:whitespace-pre-wrap [&_.line]:break-words"
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    </CodeBlock>
  );
}
