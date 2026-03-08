"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useEffect, useRef, useState } from "react";

const theme = {
  light: ["#EBEBEB", "#A8C5A6", "#6FAA6C", "#3D8A39", "#1E5B1A"],
  dark:  ["#2A2A2A", "#1A3D18", "#1D5019", "#1D651A", "#1E5B1A"],
};

// react-activity-calendar renders ~53 week columns.
// Each column is (blockSize + blockMargin) wide, blockMargin defaults to 4.
// Solving for blockSize: blockSize = floor(containerWidth / 53) - 4
const BLOCK_MARGIN = 4;
const WEEKS = 53;

export default function GithubCalendar() {
  const [isDark, setIsDark] = useState(false);
  const [blockSize, setBlockSize] = useState(12);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync dark mode with the html class
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const mo = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // Recompute blockSize whenever the container resizes
  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const computed = Math.floor(width / WEEKS) - BLOCK_MARGIN;
      setBlockSize(Math.max(6, Math.min(computed, 14)));
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
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
