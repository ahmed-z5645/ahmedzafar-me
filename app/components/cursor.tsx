"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Track raw mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Re-introducing the Spring Physics for that "magnetic" feel
  const springConfig = { damping: 25, stiffness: 250 };
  const sx = useSpring(cursorX, springConfig);
  const sy = useSpring(cursorY, springConfig);

  useEffect(() => {
    // 1. Mobile Detection: Check if the user is on a touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches || 'ontouchstart' in window);
    };
    
    checkMobile();

    const moveCursor = (e: MouseEvent) => {
      // Don't show the dot until the mouse actually moves
      if (!isVisible) setIsVisible(true);
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Event delegation for hover detection
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest('a, button, .cursor-pointer, [data-cursor]'));
    };

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

  // Don't render anything if on mobile/tablet
  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#1E5B1A] dark:bg-[#1E5B1A] z-[9999] pointer-events-none"
      style={{
        x: sx, // Using the Spring value for X
        y: sy, // Using the Spring value for Y
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovered ? 1.5 : 1,
        opacity: isVisible ? (isHovered ? 0.3 : 1) : 0,
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.15 }
      }}
    />
  );
}