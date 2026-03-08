"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useEffect, useState } from "react";

const theme = {
  light: ["#EBEBEB", "#A8C5A6", "#6FAA6C", "#3D8A39", "#1E5B1A"],
  dark:  ["#2A2A2A", "#1A3D18", "#1D5019", "#1D651A", "#1E5B1A"],
};

export default function GithubCalendar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <GitHubCalendar
      username="ahmed-z5645"
      theme={theme}
      colorScheme={isDark ? "dark" : "light"}
      style={{ color: "#5A6978", width: "100%" }}
      fontSize={12}
    />
  );
}
