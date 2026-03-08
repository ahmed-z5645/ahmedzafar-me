"use client";

const searches = [
  '"gpu-parallelized numerical library architecture"',
  '"software fda and iso standards"',
  '"the adults are talking live snl"',
  '"next.js best practices"',
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
];

const track = searches.join("   ·   ");

export default function Ticker() {
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]"
        style={{
          display: "flex",
          width: "max-content",
          animation: "ticker 35s linear infinite",
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
      >
        <span style={{ whiteSpace: "nowrap", paddingRight: "3rem" }}>{track}</span>
        <span style={{ whiteSpace: "nowrap", paddingRight: "3rem" }} aria-hidden="true">{track}</span>
      </div>
    </div>
  );
}
