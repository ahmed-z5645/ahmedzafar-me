"use client";

import { useEffect } from "react";

export default function KeyWatcher() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field (good practice)
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key.toLowerCase() === "d") {
        document.documentElement.classList.toggle("dark");
      }
      if (e.key.toLowerCase() === "n") {
        document.documentElement.classList.toggle("show-notes");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null; // It renders nothing visually
}