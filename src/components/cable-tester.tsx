// The 404 illustration: a cable tester whose wire map shows two wires lost
// (OPEN, FAIL) because the cable hangs loose beside it. When a link inside the
// same `group` ancestor is hovered, the plug slides into the port and the
// map reads PASS. Only moves on hover; reduced motion skips the slide.

const LCD_INK = "#1d2616";
/** T568B order; "white" conductors are the colour banded with cream. */
const WIRES = ["#D9711F", "#D9711F", "#2E7D46", "#2B5799", "#2B5799", "#2E7D46", "#63452E", "#63452E"];
const STRIPED = [true, false, true, false, true, false, true, false];

export function CableTester() {
  // At rest the plug hangs short of the tester's port and the wire map shows
  // two wires lost (OPEN): FAIL. Hovering "Back to the homepage" slides the
  // plug in and every wire connects: PASS.
  const move = "transition-[translate] duration-500 ease-out motion-reduce:transition-none group-has-[a:hover]:translate-x-[24px]";
  const fail = "transition-opacity duration-200 group-has-[a:hover]:opacity-0";
  const pass = "opacity-0 transition-opacity delay-300 duration-200 group-has-[a:hover]:opacity-100";
  // SVG attributes can't read CSS variables; the font goes in `style`.
  const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };
  const LOST = new Set([2, 5]); // pins 3 and 6
  return (
    <svg viewBox="0 0 520 220" className="w-full max-w-[520px] [mask-image:linear-gradient(90deg,transparent,#000_22%)]" role="img" aria-label="A network cable hanging loose beside a cable tester. The tester shows wires 3 and 6 open.">
      {/* tester body and side port */}
      <rect x="292" y="8" width="216" height="204" rx="20" fill="#2b2d31" />
      <rect x="284" y="97" width="14" height="38" rx="2" fill="#121214" />
      <rect x="308" y="24" width="184" height="152" rx="8" fill="#c6d3b0" />
      <g fill={LCD_INK} style={mono}>
        <text x="322" y="47" fontSize="13" fontWeight="700" letterSpacing="0.06em">WIRE MAP</text>
        <text x="478" y="47" fontSize="13" fontWeight="700" textAnchor="end" className={fail}>FAIL</text>
        <text x="478" y="47" fontSize="13" fontWeight="700" textAnchor="end" className={pass}>PASS</text>
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const y = 67 + i * 13.5;
        const lost = LOST.has(i);
        return (
          <g key={i} fill={LCD_INK} style={mono}>
            <text x="322" y={y + 4} fontSize="11" fontWeight="600">{i + 1}</text>
            <text x="478" y={y + 4} fontSize="11" fontWeight="600" textAnchor="end">{i + 1}</text>
            {lost ? (
              <>
                <line x1="338" y1={y} x2="376" y2={y} stroke={LCD_INK} strokeWidth="2.4" strokeLinecap="round" className={fail} />
                <text x="400" y={y + 3.5} fontSize="10" fontWeight="700" textAnchor="middle" className={fail}>OPEN</text>
              </>
            ) : null}
            <line x1="338" y1={y} x2="462" y2={y} stroke={LCD_INK} strokeWidth="2.4" strokeLinecap="round" className={lost ? pass : undefined} />
          </g>
        );
      })}
      <circle cx="400" cy="194" r="7" fill="#3a3c42" />

      {/* the loose cable: sags in from the left, plug short of the port */}
      <g className={move}>
        <path d="M-40 150 C 90 150, 130 116, 196 116" fill="none" className="stroke-foreground/70" strokeWidth="10" strokeLinecap="round" />
        <path d="M194 107 h18 l4 4 v10 l-4 4 h-18z" className="fill-foreground/80" />
        <rect x="216" y="102" width="52" height="28" rx="3" className="fill-foreground/10 stroke-foreground/60" strokeWidth="1.2" />
        {WIRES.map((c, i) => (
          <g key={i}>
            <rect x="218" y={104.5 + i * 3.1} width="46" height="2.1" fill={c} />
            {STRIPED[i] ? <rect x="218" y={104.5 + i * 3.1} width="46" height="2.1" fill="url(#tester-plug-stripe)" /> : null}
          </g>
        ))}
        <path d="M226 102 l14 -8 h6 l-12 8z" className="fill-foreground/30" />
      </g>
      <defs>
        <pattern id="tester-plug-stripe" width="6" height="3" patternUnits="userSpaceOnUse">
          <rect x="3" width="3" height="3" fill="#F1EBDE" />
        </pattern>
      </defs>
    </svg>
  );
}
