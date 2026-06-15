import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Precise, fast-tracking spring for the core laser center point
  const dotSpringX = useSpring(mouseX, { stiffness: 1000, damping: 45 });
  const dotSpringY = useSpring(mouseY, { stiffness: 1000, damping: 45 });

  // Elastic, fluid-lagging spring for the magnetic outer telemetry reticle
  const ringSpringX = useSpring(mouseX, { stiffness: 160, damping: 20 });
  const ringSpringY = useSpring(mouseY, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Disable custom cursor design elements over text input interfaces to clear any visual static
      const inputElement = target.closest("input, textarea, [contenteditable='true']");
      if (inputElement) {
        setIsInputHovered(true);
        setIsHovered(false);
        setHoverType(null);
        return;
      } else {
        setIsInputHovered(false);
      }

      const interactive = target.closest("a, button, [role='button'], select, [id^='card-']");
      if (interactive) {
        setIsHovered(true);
        if (interactive.id && interactive.id.startsWith("card-")) {
          setHoverType("card");
        } else {
          setHoverType("action");
        }
      } else {
        setIsHovered(false);
        setHoverType(null);
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, visible]);

  if (!visible || isInputHovered) return null;

  return (
    <>
      {/* 
        1. Fast Laser Core Pointer Dot 
      */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen hidden md:block"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isHovered 
              ? hoverType === "card" 
                ? "bg-amber-400 scale-150 shadow-[0_0_8px_rgba(245,158,11,0.8)]" 
                : "bg-cyan-400 scale-150 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              : "bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.6)]"
          }`} 
        />
      </motion.div>

      {/* 
        2. Drag / Fluid Magnetic Telemetry Reticle
      */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen hidden md:block"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Main outer ring frame */}
          <motion.div
            animate={{
              width: isHovered ? (hoverType === "card" ? 64 : 48) : 28,
              height: isHovered ? (hoverType === "card" ? 64 : 48) : 28,
              borderColor: isHovered 
                ? hoverType === "card" 
                  ? "rgba(245, 158, 11, 0.6)" 
                  : "rgba(34, 211, 238, 0.7)"
                : "rgba(34, 211, 238, 0.22)",
              rotate: isHovered ? 90 : 0
            }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="rounded-full border border-dashed flex items-center justify-center"
          >
            {/* Minimal Crosshair Accents */}
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className={`absolute w-full h-full flex items-center justify-center animate-[spin_8s_linear_infinite] ${
                  hoverType === "card" ? "text-amber-500/40" : "text-cyan-400/40"
                }`}
              >
                <svg width="100%" height="100%" viewBox="0 0 40 40" className="stroke-current fill-none stroke-[0.75]">
                  <path d="M20 2v4M20 34v4M2 20h4M34 20h4" />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Precision Aerospace Guided Reticle Ring */}
          <motion.div 
            animate={{
              scale: isHovered ? 1.3 : 0.85,
              opacity: isHovered ? 0.85 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            className={`absolute pointer-events-none transition-colors duration-300 ${
              isHovered 
                ? hoverType === "card" 
                  ? "text-amber-500/30" 
                  : "text-cyan-400/40"
                : "text-zinc-600/20"
            }`}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="stroke-[1.0] animate-[spin_12s_linear_infinite]"
            >
              {/* Outer locked-on HUD brackets */}
              <path d="M5 3H3v2M19 3h2v2M5 21H3v-2M19 21h2v-2" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
