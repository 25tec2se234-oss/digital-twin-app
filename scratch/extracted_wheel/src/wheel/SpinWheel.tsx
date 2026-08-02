import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Particles from "./Particles";
import Celebration, { type CelebrationMode } from "./Celebration";
import WheelDial from "./WheelDial";
import Needle, { type NeedleHandle } from "./Needle";
import RewardCard from "./RewardCard";
import { audio } from "./audio";
import { randomSpinPlan } from "./easing";
import { REWARDS, MOTIVATIONS, tierOf, pickWeightedIndex, rotationDeltaForIndex, segmentIndexAtRotation, type Reward, type Tier } from "./rewards";

type Phase = "idle" | "charging" | "spinning" | "landed";

/** Timings for the post-stop confirmation ritual (ms after the wheel is mathematically locked). */
const REVEAL_TIMING = { glow: 0, beam: 900, awaken: 1500, card: 2250 };

export default function SpinWheel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<NeedleHandle>(null);

  const energyRef = useRef(0);
  const hoverRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const rotationRef = useRef(0);
  const spinningRef = useRef(false);
  const rafRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [revealStep, setRevealStep] = useState(0); // 0 none · 1 glow+outline · 2 beam · 3 awaken · 4 card
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Reward | null>(null);
  const [motivation, setMotivation] = useState(MOTIVATIONS[0]);
  const [pulseKey, setPulseKey] = useState(0);

  const tier: Tier | null = result ? tierOf(result) : null;
  const celebMode: CelebrationMode = phase === "landed" && revealStep >= 4 ? tier : null;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    cancelAnimationFrame(rafRef.current);
    spinningRef.current = false;
    setPhase("idle");
    setResult(null);
    setWinningIndex(null);
    setRevealStep(0);
    if (cameraRef.current) cameraRef.current.style.transform = "scale(1)";
  }, [clearTimers]);

  /**
   * The spin sequence, step by step:
   *  1. Backend securely selects the winning reward (weighted, hidden).
   *  2. The exact rotation delta that carries that segment's mathematical
   *     center to the fixed needle is computed once, up front.
   *  3. A randomized physics profile animates the journey there — duration,
   *     easing, and rotation count all vary; the destination never does.
   *  4. On completion the disc is snapped to the exact locked angle, then
   *     the displayed reward is *re-derived from that angle* rather than
   *     from the backend variable, so the needle is truly authoritative.
   */
  const spin = useCallback(() => {
    if (spinningRef.current) return;
    spinningRef.current = true;
    audio.ensure();
    audio.charge();
    clearTimers();
    setResult(null);
    setWinningIndex(null);
    setRevealStep(0);
    setPhase("charging");
    setPulseKey((k) => k + 1);
    if (cameraRef.current) cameraRef.current.style.transform = "scale(1)";

    const chosenIndex = pickWeightedIndex(); // backend authority
    const current = rotationRef.current;
    const { delta } = rotationDeltaForIndex(chosenIndex, current);
    const plan = randomSpinPlan();

    window.setTimeout(() => {
      setPhase("spinning");
      const t0 = performance.now();
      const SEG_ANGLE = 360 / REWARDS.length;
      let prevTickIdx = Math.floor((((current % 360) + 360) % 360) / SEG_ANGLE);
      let prevEased = 0;
      let prevT = t0;

      const frame = (now: number) => {
        const p = Math.min(1, (now - t0) / plan.durationMs);
        const eased = plan.ease(p);
        const rot = current + delta * eased;
        const dt = Math.max(14, now - prevT);
        const vel = ((eased - prevEased) * delta * 1000) / dt; // deg/s, real derivative
        prevEased = eased;
        prevT = now;

        rotationRef.current = rot;
        if (discRef.current) discRef.current.style.transform = `rotate(${rot}deg)`;

        const energy = Math.min(1, Math.abs(vel) / 950);
        energyRef.current = energy;
        if (streakRef.current) streakRef.current.style.opacity = (energy * 0.88).toFixed(3);
        if (cameraRef.current) cameraRef.current.style.transform = `scale(${(1 + energy * 0.022).toFixed(4)})`;

        const norm = ((rot % 360) + 360) % 360;
        const tickIdx = Math.floor(norm / SEG_ANGLE);
        if (tickIdx !== prevTickIdx) {
          prevTickIdx = tickIdx;
          needleRef.current?.kick(Math.min(1, 0.4 + energy));
          audio.tick(Math.min(1, Math.abs(vel) / 720));
        }

        if (p < 1) {
          rafRef.current = requestAnimationFrame(frame);
          return;
        }

        /* Mathematically exact lock — zero error, then a single damped mechanical wobble. */
        const lockedAngle = current + delta;
        rotationRef.current = lockedAngle;
        if (discRef.current) discRef.current.style.transform = `rotate(${lockedAngle}deg)`;

        const bDur = 480 + Math.random() * 160;
        const b0 = performance.now();
        const bounce = (now2: number) => {
          const q = Math.min(1, (now2 - b0) / bDur);
          const overshoot = Math.sin(q * Math.PI * 1.6) * 0.7 * (1 - q); // fully damped, never crosses into another segment
          const rot2 = lockedAngle + overshoot;
          rotationRef.current = rot2;
          if (discRef.current) discRef.current.style.transform = `rotate(${rot2}deg)`;
          energyRef.current = (1 - q) * 0.06;
          if (q < 1) {
            rafRef.current = requestAnimationFrame(bounce);
            return;
          }

          /* Final absolute snap — the wheel is now physically at rest. */
          rotationRef.current = lockedAngle;
          if (discRef.current) discRef.current.style.transform = `rotate(${lockedAngle}deg)`;
          energyRef.current = 0;
          if (streakRef.current) streakRef.current.style.opacity = "0";
          if (cameraRef.current) {
            cameraRef.current.style.transform = "scale(1)";
            cameraRef.current.animate([{ transform: "scale(1.025)" }, { transform: "scale(1)" }], {
              duration: 1000,
              easing: "cubic-bezier(.16,1,.3,1)",
            });
          }

          /* The needle's single, strongest, most satisfying click. */
          needleRef.current?.kick(1.4);
          audio.tick(0.75);
          spinningRef.current = false;

          /* ── THE NEEDLE IS THE SINGLE SOURCE OF TRUTH ── */
          const confirmedIndex = segmentIndexAtRotation(lockedAngle);
          const confirmed = REWARDS[confirmedIndex];

          setWinningIndex(confirmedIndex);
          setResult(confirmed);
          setMotivation(MOTIVATIONS[(Math.random() * MOTIVATIONS.length) | 0]);
          setPhase("landed");
          setRevealStep(1); // segment illuminates · outline expands · others dim

          const t = tierOf(confirmed);
          timersRef.current.push(
            window.setTimeout(() => {
              setRevealStep(2);
              audio.beam();
            }, REVEAL_TIMING.beam),
            window.setTimeout(() => {
              setRevealStep(3);
              audio.awaken(t === "rare");
            }, REVEAL_TIMING.awaken),
            window.setTimeout(() => {
              setRevealStep(4);
              if (t === "rare") audio.jackpot();
              else if (t === "medium") audio.victory();
              else audio.luck();
            }, REVEAL_TIMING.card)
          );
        };
        rafRef.current = requestAnimationFrame(bounce);
      };
      rafRef.current = requestAnimationFrame(frame);
    }, 340);
  }, [clearTimers]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      clearTimers();
    },
    [clearTimers]
  );

  /* cursor-reactive lighting + magnetic drift toward the pointer */
  const onMove = useCallback((e: ReactPointerEvent) => {
    const root = rootRef.current;
    const mag = magnetRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    root.style.setProperty("--lx", `${50 + nx * 90}%`);
    root.style.setProperty("--ly", `${50 + ny * 90}%`);
    if (mag && !spinningRef.current) {
      mag.style.transform = `translate(${(nx * 10).toFixed(1)}px, ${(ny * 8).toFixed(1)}px)`;
    }
  }, []);
  const onEnter = useCallback(() => {
    hoverRef.current = true;
  }, []);
  const onLeave = useCallback(() => {
    hoverRef.current = false;
    if (magnetRef.current) magnetRef.current.style.transform = "translate(0px, 0px)";
  }, []);

  const landed = phase === "landed";

  return (
    <div
      ref={rootRef}
      className="relative flex h-full w-full flex-col items-center justify-center"
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Particles energyRef={energyRef} hoverRef={hoverRef} />

      {/* camera zoom layer */}
      <div ref={cameraRef} className="relative will-change-transform">
        {/* magnetic drift layer */}
        <div ref={magnetRef} className="relative transition-transform duration-500 ease-out will-change-transform">
          {/* floating layer */}
          <div className="wheel-float group/wheel relative">
            <div className="wheel-lift relative aspect-square w-[clamp(280px,88vw,620px)]">
              {/* celebration light layers — only after the needle has fully stopped */}
              {landed && revealStep >= 3 && tier !== "common" && <div className="win-rays pointer-events-none absolute -inset-[55%]" aria-hidden="true" />}
              {landed && revealStep >= 3 && tier === "rare" && <div className="jackpot-beams pointer-events-none absolute -inset-[48%]" aria-hidden="true" />}
              {landed && revealStep >= 3 && tier === "rare" && <div className="jackpot-halo pointer-events-none absolute -inset-[14%]" aria-hidden="true" />}

              <WheelDial
                discRef={discRef}
                streakRef={streakRef}
                phase={phase}
                revealStep={revealStep}
                winningIndex={winningIndex}
                tier={tier}
                pulseKey={pulseKey}
                onSpin={spin}
              />

              <Needle ref={needleRef} />

              {landed && revealStep >= 4 && result && tier && (
                <RewardCard reward={result} tier={tier} motivation={motivation} pulseKey={pulseKey} onSpinAgain={reset} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Celebration mode={celebMode} triggerKey={pulseKey} />

      {/* whisper caption — fixed height keeps the stage stable, no layout shift */}
      <div className="pointer-events-none relative z-10 mt-9 flex h-16 items-start justify-center px-6 text-center">
        {phase === "spinning" || phase === "charging" ? (
          <span className="caption-in pt-2 font-body text-xs font-light uppercase tracking-[0.5em] text-[#6E7FA3]">Simulating your future</span>
        ) : phase === "idle" ? (
          <span className="pt-2 font-body text-xs font-light uppercase tracking-[0.5em] text-[#6E7FA3]">
            Touch the core <span className="mx-2 text-[#D4AF37]">·</span> spin the verse
          </span>
        ) : null}
      </div>
    </div>
  );
}
