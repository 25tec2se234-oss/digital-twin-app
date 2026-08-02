import { SegmentIcon } from "./icons";
import { grantsAnotherSpin, type Reward, type Tier } from "./rewards";

/**
 * The reward reveal. This card's content is derived exclusively from the
 * `reward` prop passed to it, which the orchestrator computes directly from
 * the needle's final resting position — never from a separate "what did we
 * pick" variable. Whatever this card shows is, by construction, exactly
 * what is beneath the needle.
 */
export default function RewardCard({
  reward,
  tier,
  motivation,
  pulseKey,
  onSpinAgain,
}: {
  reward: Reward;
  tier: Tier;
  motivation: string;
  pulseKey: number;
  onSpinAgain: () => void;
}) {
  const isCommon = tier === "common";
  const isRare = tier === "rare";
  const anotherSpin = grantsAnotherSpin(reward);
  const eyebrow = isRare
    ? "A rare alignment · Congratulations"
    : anotherSpin
      ? "The wheel turns again"
      : isCommon
        ? "The journey continues"
        : "Congratulations";
  const badgeStroke = isCommon ? "#BFD4FF" : "#F6E6A4";
  const iconStroke = isRare ? "#F6E6A4" : isCommon ? "#BFD4FF" : "#C7D4F2";

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      {/* premium light connecting the needle to the reward card */}
      <div className="link-beam pointer-events-none absolute left-1/2 top-[11.5%] h-[21%] w-[2px] -translate-x-1/2" aria-hidden="true" />
      <div className="card-glow pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />

      <div key={`c${pulseKey}`} className={`reward-card pointer-events-auto ${isRare ? "is-rare" : anotherSpin ? "is-spin" : isCommon ? "is-common" : ""} px-7 py-7 text-center sm:px-9`}>
        <div className="card-sheen pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <svg viewBox="-12 -12 24 24" className="h-4 w-4" aria-hidden="true">
              <SegmentIcon name={isCommon ? "sparkle" : "trophy"} size={20} stroke={badgeStroke} strokeWidth={1.5} />
            </svg>
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.42em] text-[#C9A53D]">{eyebrow}</p>
            <svg viewBox="-12 -12 24 24" className="h-4 w-4" aria-hidden="true">
              <SegmentIcon name={isCommon ? "sparkle" : "trophy"} size={20} stroke={badgeStroke} strokeWidth={1.5} />
            </svg>
          </div>

          <div className="mb-4 flex items-center justify-center">
            <div className="icon-disc flex h-14 w-14 items-center justify-center rounded-full">
              <svg viewBox="-12 -12 24 24" className="h-7 w-7" aria-hidden="true">
                <SegmentIcon name={reward.icon} size={26} stroke={iconStroke} strokeWidth={1.5} />
              </svg>
            </div>
          </div>

          <p className="mb-1 font-body text-[10px] font-light uppercase tracking-[0.3em] text-[#8FA0C4]">
            {anotherSpin ? "The needle granted you" : "The needle landed on"}
          </p>
          <h2 className={`${isRare ? "gold-text-bright" : "gold-text"} font-display text-[34px] font-semibold italic leading-tight [text-wrap:balance] sm:text-[40px]`}>{reward.label}</h2>

          <p className="mx-auto mt-3 max-w-[300px] font-body text-[12.5px] font-light leading-relaxed tracking-wide text-[#AEBBD8]">{reward.description}</p>

          <div className="mx-auto my-4 h-px w-24" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)" }} />

          <p className="font-display text-[15px] font-medium italic leading-snug text-[#D7E0F4]">{motivation}</p>

          <button
            type="button"
            onClick={onSpinAgain}
            className="spin-again pointer-events-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-5 py-2 font-body text-[10px] font-medium uppercase tracking-[0.32em] text-[#C9A53D] outline-none focus-visible:ring-2 focus-visible:ring-[#F2DD8F]/70"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {anotherSpin ? "Use Extra Spin" : "Spin Again"}
          </button>
        </div>
      </div>
    </div>
  );
}
