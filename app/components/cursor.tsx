"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Track raw mouse position directly
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // 1. If the mouse moves, it's definitely not a phone touch scroll
      if (!isVisible) setIsVisible(true);

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // 2. Hover detection
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest('a, button, .cursor-pointer, [data-cursor]'));
    };

    // 3. Hide when the mouse leaves the window (fixes the "stuck on edge" issue)
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-accent z-[9999] pointer-events-none"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovered ? 1.75 : 1,
        // It stays at 0 opacity until the first mousemove
        opacity: isVisible ? (isHovered ? 0.3 : 1) : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.1 }
      }}
    />
  );
}
