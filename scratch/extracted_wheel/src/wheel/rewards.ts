/**
 * ─────────────────────────────────────────────────────────────────────────
 *  DTV WHEEL — GEOMETRY & REWARD ENGINE
 * ─────────────────────────────────────────────────────────────────────────
 *  This module is the single mathematical source of truth for the wheel.
 *  Every angle, every segment boundary, and — most importantly — the
 *  function that decides "what reward is the needle pointing at" all live
 *  here, so there is exactly one place where that truth can be computed.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Tier = "rare" | "medium" | "common";

export interface Reward {
  id: string;
  /** Primary line rendered on the wheel segment. */
  title: string;
  /** Optional secondary line rendered beneath the title. */
  subtitle?: string;
  icon: string;
  /** Relative probability weight — never exposed to the client UI. */
  weight: number;
  gradientId: string;
  iconColor: string;
  variant: "default" | "gold";
  /** Full human-readable name shown on the reward card. */
  label: string;
  description: string;
}

/* ───────────────────────── geometry constants ───────────────────────── */

export const VIEWBOX = 720;
export const CENTER = VIEWBOX / 2;
export const OUTER_RADIUS = 300;
export const DIVIDER_INNER_RADIUS = 136;
export const HUB_RADIUS = 126;

/* The needle is mechanically fixed at the top of the instrument.
   In standard screen/SVG angle convention (0° = right, 90° = down,
   clockwise positive), "top" is -90°. Only the disc ever rotates. */
export const NEEDLE_ANGLE = -90;

/* ───────────────────────── reward configuration ───────────────────────── */

export const REWARDS: Reward[] = [
  {
    id: "streak",
    title: "STREAK",
    subtitle: "SAVER",
    icon: "flame",
    weight: 5, // 5%
    gradientId: "gNavyA",
    iconColor: "#C7D4F2",
    variant: "default",
    label: "Streak Saver",
    description: "Your streak is protected. One missed day will no longer undo the momentum you've built — consistency preserved.",
  },
  {
    id: "tour",
    title: "VIRTUAL",
    subtitle: "TOUR",
    icon: "headset",
    weight: 2.9, // 2.9%
    gradientId: "gNavyB",
    iconColor: "#C7D4F2",
    variant: "default",
    label: "Virtual Tour of DTV",
    description: "You've unlocked a guided Virtual Tour of DigitalTwin Verse — an insider's walk through the platform simulating your future.",
  },
  {
    id: "extraspin",
    title: "EXTRA",
    subtitle: "SPIN",
    icon: "extraspin",
    weight: 40, // 40%
    gradientId: "gNavyC",
    iconColor: "#9DB4E8",
    variant: "default",
    label: "Extra Spin",
    description: "The wheel turns again. You've earned one more spin — fortune has a way of favouring persistence.",
  },
  {
    id: "luck",
    title: "BETTER",
    subtitle: "LUCK",
    icon: "star",
    weight: 12, // 12%
    gradientId: "gNavyA",
    iconColor: "#8FA6D8",
    variant: "default",
    label: "Better Luck Next Time",
    description: "The wheel turned elsewhere this time — but every spin sharpens your sense of direction. Your moment is still ahead.",
  },
  {
    id: "mentor1w",
    title: "1 WEEK",
    subtitle: "MENTORSHIP",
    icon: "cap",
    weight: 0.1, // 0.1% — the rarest alignment
    gradientId: "gGold",
    iconColor: "#F6E6A4",
    variant: "gold",
    label: "1 Week Free Mentorship",
    description: "You've unlocked One Week of Free Mentorship — real guidance from experts who have walked the path ahead of you.",
  },
  {
    id: "try",
    title: "TRY AGAIN",
    subtitle: "TOMORROW",
    icon: "refresh",
    weight: 40, // 40%
    gradientId: "gNavyB",
    iconColor: "#8FA6D8",
    variant: "default",
    label: "Try Again Tomorrow",
    description: "Not today — but tomorrow's spin is already waiting. Return with fresh momentum and turn the wheel again.",
  },
];

/* Every segment derives from the reward list — always equal-sized, always in sync. */
export const SEGMENT_COUNT = REWARDS.length;
export const SEG_ANGLE = 360 / SEGMENT_COUNT;

export const MOTIVATIONS = [
  "Every achievement brings you one step closer to your dream career.",
  "Keep learning. Your future is built one milestone at a time.",
  "Today's reward is another investment in tomorrow's success.",
];

export function tierOf(r: Reward): Tier {
  if (r.id === "mentor1w") return "rare";
  if (r.id === "luck" || r.id === "try") return "common";
  return "medium";
}

/** Rewards that grant another turn — the card invites the user straight back in. */
export function grantsAnotherSpin(r: Reward): boolean {
  return r.id === "extraspin";
}

/* ───────────────────────── weighted selection (backend authority) ───────────────────────── */

/** In production this call belongs to a trusted backend endpoint. */
export function pickWeightedIndex(): number {
  const total = REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < REWARDS.length; i++) {
    roll -= REWARDS[i].weight;
    if (roll <= 0) return i;
  }
  return 0;
}

/* ───────────────────────── angle & path math ───────────────────────── */

export function polar(radius: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CENTER + radius * Math.cos(a), CENTER + radius * Math.sin(a)];
}

/** The unrotated (local) start/center/end angle of a given segment index. */
export function segmentBounds(index: number) {
  const start = NEEDLE_ANGLE + index * SEG_ANGLE;
  const end = start + SEG_ANGLE;
  const center = start + SEG_ANGLE / 2;
  return { start, end, center };
}

export function segmentPath(index: number): string {
  const { start, end } = segmentBounds(index);
  const [x0, y0] = polar(OUTER_RADIUS, start);
  const [x1, y1] = polar(OUTER_RADIUS, end);
  return `M ${CENTER} ${CENTER} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/** An annular (donut) wedge, used for the fixed glow/outline above the needle. */
export function annulusPath(a0: number, a1: number, r0: number, r1: number): string {
  const [ox0, oy0] = polar(r1, a0);
  const [ox1, oy1] = polar(r1, a1);
  const [ix0, iy0] = polar(r0, a0);
  const [ix1, iy1] = polar(r0, a1);
  return `M ${ox0.toFixed(2)} ${oy0.toFixed(2)} A ${r1} ${r1} 0 0 1 ${ox1.toFixed(2)} ${oy1.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${r0} ${r0} 0 0 0 ${ix0.toFixed(2)} ${iy0.toFixed(2)} Z`;
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THE NEEDLE IS THE SINGLE SOURCE OF TRUTH.
 *
 *  Given the disc's current rotation (in degrees, any magnitude), this
 *  returns the index of the reward segment physically resting beneath the
 *  fixed needle. The backend's chosen index only ever *steers* where the
 *  animation is aimed — the reward that is ultimately displayed to the
 *  user is always re-derived from this function, from the wheel's true
 *  final resting position. Display and needle can never disagree.
 *
 *  Derivation: a point drawn at local angle θ appears on screen at
 *  (θ + rotation) after the disc is rotated. The needle sits at -90°, so
 *  the segment under it satisfies (θ + rotation) ≡ -90 (mod 360), i.e.
 *  θ ≡ -90 - rotation (mod 360). Segment i's local span is
 *  [-90 + i·SEG, -90 + (i+1)·SEG), so shifting θ by +90 and reducing
 *  modulo 360 yields a value in [0, 360) whose containing 40° bracket is
 *  the answer. Algebraically this collapses to (−rotation mod 360).
 * ─────────────────────────────────────────────────────────────────────────
 */
export function segmentIndexAtRotation(rotationDeg: number): number {
  const local = (((-rotationDeg) % 360) + 360) % 360;
  return Math.floor(local / SEG_ANGLE) % SEGMENT_COUNT;
}

/**
 * Computes the positive rotation delta that carries segment `index`'s
 * mathematical center to rest exactly beneath the needle, including a
 * randomized number of full celebratory turns. The stopping position is
 * always mathematically exact — only the journey there varies.
 */
export function rotationDeltaForIndex(index: number, currentRotation: number, minTurns = 4, maxTurns = 7) {
  const { center } = segmentBounds(index);
  const targetMod = (((NEEDLE_ANGLE - center) % 360) + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const turns = minTurns + Math.floor(Math.random() * (maxTurns - minTurns + 1));
  const delta = (((targetMod - currentMod) % 360) + 360) % 360 + 360 * turns;
  return { delta, turns };
}

/* ───────────────────────── typography auto-fit ───────────────────────── */

/** Scales a font size down when text length would risk overflowing its segment. */
export function fitFontSize(text: string, base: number, maxChars: number): number {
  if (text.length <= maxChars) return base;
  const scale = Math.max(0.72, maxChars / text.length);
  return Math.round(base * scale * 10) / 10;
}
