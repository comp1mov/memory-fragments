import type { CSSProperties } from "react";

type PointFieldProps = {
  seed: string;
  density?: "card" | "detail";
};

type PointStyle = CSSProperties & {
  "--x": string;
  "--y": string;
  "--point-size": string;
  "--point-color": string;
  "--point-opacity": string;
};

const colors = [
  "var(--text)",
  "var(--accent)",
  "var(--warm)",
  "var(--cold)",
  "rgba(244, 241, 234, 0.72)"
];

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function nextValue(state: number): number {
  return (Math.imul(1664525, state) + 1013904223) >>> 0;
}

function createPointStyles(seed: string, count: number): PointStyle[] {
  let state = hashSeed(seed);

  return Array.from({ length: count }, (_, index) => {
    state = nextValue(state + index);
    const x = 6 + (state % 8800) / 100;
    state = nextValue(state);
    const y = 8 + (state % 8200) / 100;
    state = nextValue(state);
    const size = 1 + (state % 260) / 100;
    state = nextValue(state);
    const opacity = 0.36 + (state % 560) / 1000;

    return {
      "--x": `${x}%`,
      "--y": `${y}%`,
      "--point-size": `${size}px`,
      "--point-color": colors[state % colors.length],
      "--point-opacity": `${opacity}`
    };
  });
}

export function PointField({ seed, density = "card" }: PointFieldProps) {
  const points = createPointStyles(seed, density === "detail" ? 54 : 26);

  return (
    <div className={`point-field point-field--${density}`} aria-hidden="true">
      {points.map((style, index) => (
        <span key={`${seed}-${index}`} style={style} />
      ))}
    </div>
  );
}
