import { cn } from "@/lib/cn";

// The brand's signature: the eight conductors of a T568B pair, in pin order
// (white-orange, orange, white-green, blue, white-blue, green, white-brown,
// brown). Striped conductors are the colour banded with cream. Use it as a
// bookend only: under the cover and at the top of the footer.
const CREAM = "#F1EBDE";
const PINS: { color: string; striped?: boolean }[] = [
  { color: "#D9711F", striped: true },
  { color: "#D9711F" },
  { color: "#2E7D46", striped: true },
  { color: "#2B5799" },
  { color: "#2B5799", striped: true },
  { color: "#2E7D46" },
  { color: "#63452E", striped: true },
  { color: "#63452E" },
];

export function ConductorStripe({ className }: { className?: string }) {
  return (
    <div className={cn("grid h-1 w-full grid-cols-8", className)} aria-hidden>
      {PINS.map((pin, i) => (
        <span
          key={i}
          style={{
            background: pin.striped
              ? `repeating-linear-gradient(90deg, ${pin.color} 0 12px, ${CREAM} 12px 18px)`
              : pin.color,
          }}
        />
      ))}
    </div>
  );
}
