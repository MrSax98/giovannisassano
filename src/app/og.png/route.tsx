import { ImageResponse } from "next/og";
import { gaussian, mulberry32 } from "@/lib/random";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

/**
 * Social card, rendered once at build time to /og.png (a real file with a real
 * extension, so every static host serves it as image/png).
 * The hero figure, frozen: random walks and the density they converge to.
 */
export function GET() {
  const rand = mulberry32(7);
  const randn = gaussian(rand);
  const x0 = 640;
  const x1 = 1020;
  const y0 = 315;
  const steps = 60;
  const sigma = 70 / Math.sqrt(steps);
  const paths: string[] = [];
  for (let k = 0; k < 46; k++) {
    let y = y0;
    let d = `M${x0} ${y0}`;
    for (let i = 1; i <= steps; i++) {
      y += sigma * randn();
      d += `L${(x0 + ((x1 - x0) * i) / steps).toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  let curve = "";
  for (let y = 120; y <= 510; y += 4) {
    const z = (y - y0) / 70;
    const x = x1 + 16 + Math.exp(-0.5 * z * z) * 120;
    curve += `${y === 120 ? "M" : "L"}${x.toFixed(1)} ${y}`;
  }

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3f0e8", position: "relative" }}>
      <svg width="1200" height="630" style={{ position: "absolute", left: 0, top: 0 }}>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 9 === 0 ? "#b0330e" : "#151513"}
            strokeOpacity={i % 9 === 0 ? 0.8 : 0.2}
            strokeWidth={1.4}
          />
        ))}
        <line x1={x0} y1={110} x2={x0} y2={520} stroke="#151513" strokeOpacity={0.3} />
        <line x1={x1} y1={110} x2={x1} y2={520} stroke="#151513" strokeOpacity={0.3} strokeDasharray="3 6" />
        <path d={curve} fill="none" stroke="#b0330e" strokeWidth={3} />
      </svg>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 620 }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7c7a71",
            fontFamily: "monospace",
          }}
        >
          Mathematician · Statistician · AI Engineer
        </div>
        <div
          style={{
            fontSize: 92,
            lineHeight: 0.95,
            color: "#151513",
            marginTop: 28,
            letterSpacing: -2,
            fontFamily: "serif",
          }}
        >
          Giovanni Sassano
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.3, color: "#4b4a44", marginTop: 30 }}>
          Most of what I build starts as a probability distribution and ends as a running service.
        </div>
      </div>
    </div>,
    size,
  );
}
