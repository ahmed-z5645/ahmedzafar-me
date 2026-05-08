"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const EDGE = 2;
    const moveCursor = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const atEdge =
        x <= EDGE || y <= EDGE || x >= w - EDGE || y >= h - EDGE;

      if (atEdge) {
        setIsVisible(false);
        return;
      }

      if (!isVisible) setIsVisible(true);
      cursorX.set(x);
      cursorY.set(y);
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest('a, button, .cursor-pointer, [data-cursor]'));
    };

    const handleDocLeave = () => setIsVisible(false);
    const handleDocEnter = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    const handleTouch = () => setIsVisible(false);

    const html = document.documentElement;

    window.addEventListener("mousemove", moveCursor);
    html.addEventListener("mouseleave", handleDocLeave);
    html.addEventListener("mouseenter", handleDocEnter);
    html.addEventListener("pointerleave", handleDocLeave);
    html.addEventListener("pointerenter", handleDocEnter);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      html.removeEventListener("mouseleave", handleDocLeave);
      html.removeEventListener("mouseenter", handleDocEnter);
      html.removeEventListener("pointerleave", handleDocLeave);
      html.removeEventListener("pointerenter", handleDocEnter);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch) return null;

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
        opacity: isVisible ? (isHovered ? 0.3 : 1) : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.1 }
      }}
    />
  );
}
