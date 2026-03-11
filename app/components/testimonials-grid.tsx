"use client";

import { useRef, useMemo, useEffect, useState, type RefObject } from "react";
import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";

type Testimonial = { id: string; image: string };

function TestimonialItem({
  t,
  containerRef,
  initialX,
  initialY,
  rotate,
}: {
  t: Testimonial;
  containerRef: RefObject<HTMLDivElement | null>;
  initialX: number;
  initialY: number;
  rotate: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    x.set(initialX);
    y.set(initialY);
  }, [x, y, initialX, initialY]);

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, zIndex: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "28%",
        x,
        y,
        rotate,
      }}
      data-cursor
      className="cursor-grab active:cursor-grabbing"
    >
      <Image
        src={t.image}
        alt="group chat screenshot"
        width={600}
        height={400}
        className="w-full h-auto rounded-xl pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export default function TestimonialsBoard({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const transforms = useMemo(
    () =>
      items.map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return { xFrac: 0.03 + col * 0.32, yFrac: 0.05 + row * 0.45 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [rotations, setRotations] = useState<number[]>(() => items.map(() => 0));
  useEffect(() => {
    setRotations(items.map(() => (Math.random() - 0.5) * 10));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [positions, setPositions] = useState(() =>
    transforms.map((t) => ({ x: t.xFrac * 900, y: t.yFrac * 480 }))
  );

  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth;
    const h = ref.current.offsetHeight;
    setPositions(transforms.map((t) => ({ x: t.xFrac * w, y: t.yFrac * h })));
  }, [transforms]);

  const dotBg = {
    backgroundImage:
      "radial-gradient(circle, color-mix(in srgb, var(--color-foreground) 20%, transparent) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  };

  return (
    <>
      {/* Mobile: simple stacked grid */}
      <div className="md:hidden columns-2 gap-4" style={dotBg}>
        {items.map((t) => (
          <div key={t.id} className="break-inside-avoid mb-4">
            <Image src={t.image} alt="group chat screenshot" width={600} height={400} className="w-full h-auto rounded-xl" />
          </div>
        ))}
      </div>

      {/* Desktop: draggable board */}
      <div ref={ref} className="relative hidden md:block w-full h-[480px] rounded-xl" style={dotBg}>
        {items.map((t, i) => (
          <TestimonialItem
            key={t.id}
            t={t}
            containerRef={ref}
            initialX={positions[i]?.x ?? i * 220}
            initialY={positions[i]?.y ?? 20}
            rotate={rotations[i] ?? 0}
          />
        ))}
      </div>
    </>
  );
}
