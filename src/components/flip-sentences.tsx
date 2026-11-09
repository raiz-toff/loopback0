"use client";

import { useEffect, useState } from "react";

export default function FlipSentences({
  sentences,
  className = "",
}: {
  sentences: (string | React.ReactNode)[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % sentences.length),
      3200
    );
    return () => clearInterval(id);
  }, [sentences.length]);

  return (
    <div className={className}>
      <div
        key={index}
        className="flip-item text-shine text-sm text-balance text-muted-foreground flex items-center gap-1.5"
      >
        {sentences[index]}
      </div>
    </div>
  );
}
