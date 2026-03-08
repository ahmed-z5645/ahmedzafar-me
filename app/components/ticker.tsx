"use client";

const searches = [
  '"gpu-parallelized numerical library architecture"',
  '"software fda and iso standards"',
  '"the adults are talking live snl"',
  '"next.js best practices"',
  '"PQ203 Phase I clinical trials"',
  '"modelling peptide-peptide interactions"',
  '"setting up your home server"',
  '"should i actually use a clawdebot?"',
  '"guitar to piano guide"',
  '"how does airdrop work"',
  '"frozen bananas banana bread recipe"',
  '"biomechanics of the patellar joint"',
  '"real-time machine learning in health"',
  '"cuda c++ parallel reduction optimization"',
  '"claude config files"',
  '"concerts near me"',
  '"how to make a website like ahmedzafar.me"',
];

// Trailing separator so the repeat joins seamlessly
const track = searches.join("   ·   ") + "   ·   ";

export default function Ticker() {
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]"
        style={{
          display: "flex",
          width: "max-content",
          animation: "ticker 90s linear infinite",
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
      >
        <span style={{ whiteSpace: "nowrap" }}>{track}</span>
        <span style={{ whiteSpace: "nowrap" }} aria-hidden="true">{track}</span>
      </div>
    </div>
  );
}
