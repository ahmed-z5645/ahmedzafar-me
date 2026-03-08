"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useEffect, useRef, useState } from "react";

const theme = {
  light: ["#EBEBEB", "#A8C5A6", "#6FAA6C", "#3D8A39", "#1E5B1A"],
  dark:  ["#2A2A2A", "#1A3D18", "#1D5019", "#1D651A", "#1E5B1A"],
};

const BLOCK_MARGIN = 4;
const WEEKS = 53;

export default function GithubCalendar() {
  const [isDark, setIsDark] = useState(false);
  const [blockSize, setBlockSize] = useState(12);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Dark mode observer ---
    const updateDark = () => {
      const next = document.documentElement.classList.contains("dark");
      setIsDark(prev => (prev === next ? prev : next));
    };
    updateDark();
    const mo = new MutationObserver(updateDark);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Resize observer ---
    const calculate = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const next = Math.max(6, Math.min(Math.floor(width / WEEKS) - BLOCK_MARGIN, 14));
      setBlockSize(prev => (prev === next ? prev : next));
    };
    calculate();
    const ro = new ResizeObserver(calculate);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <GitHubCalendar
        username="ahmed-z5645"
        theme={theme}
        colorScheme={isDark ? "dark" : "light"}
        blockSize={blockSize}
        blockMargin={BLOCK_MARGIN}
        fontSize={11}
        style={{ color: "#5A6978" }}
      />
    </div>
  );
}
