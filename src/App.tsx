import React, { useRef, useState, useEffect } from "react";
import GlobalNavigation from "./components/GlobalNavigation";
import BootSequence from "./components/BootSequence";
import EnterpriseArchitecture from "./components/EnterpriseArchitecture";
import TechStack from "./components/TechStack";
import SystemPayloads from "./components/SystemPayloads";
import LiveTelemetryTerminal from "./components/LiveTelemetryTerminal";
import ContactSection from "./components/ContactSection";
import CustomCursor from "./components/CustomCursor";
import ThreeCanvas from "./components/ThreeCanvas";
import TiltedCard from "./components/TiltedCard";
import { Mail, FileText, Github, Linkedin } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";

export default function App() {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track absolute scroll position of our custom scroll container containerRef
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // Apply a smooth spring transition suitable for telemetry readouts
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  // High-performance physics-interpolated scroll momentum system
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScroll = container.scrollTop;
    let currentScroll = container.scrollTop;
    let isMoving = false;
    let animationFrameId: number;

    const handleWheel = (e: WheelEvent) => {
      // Prevent horizontal and trackpad swiping from getting intercepted
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      const maxScroll = container.scrollHeight - container.clientHeight;
      
      // Snappy and responsive speed tuning:
      // Normalize high-res trackpads and standard notched mouse wheel steps.
      const absDeltaY = Math.abs(e.deltaY);
      let speedMultiplier = 1.0;
      
      if (absDeltaY < 15) {
        speedMultiplier = 2.0; // trackpad soft-boost
      } else if (e.deltaMode === 1) {
        speedMultiplier = 20.0; // Lines mode
      } else {
        speedMultiplier = 1.3; // Standard wheel boost
      }

      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY * speedMultiplier));

      if (!isMoving) {
        isMoving = true;
        animate();
      }
    };

    const handleScroll = () => {
      // Only synchronize scrollbar drag coordinates if we are not currently animating momentum
      if (isMoving) return;
      
      if (Math.abs(container.scrollTop - currentScroll) > 15) {
        targetScroll = container.scrollTop;
        currentScroll = container.scrollTop;
      }
    };

    const animate = () => {
      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) > 0.1) {
        // High fidelity damping speed of 0.22 delivers immediate response and butter-smooth glide
        currentScroll += diff * 0.22;
        container.scrollTop = currentScroll;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        currentScroll = targetScroll;
        container.scrollTop = currentScroll;
        isMoving = false;
      }
    };

    // Passive false represents mandatory prerequisite for cancelable wheels
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Globally bind customized coordinate teleportation mechanics
  useEffect(() => {
    (window as any).scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      const container = containerRef.current;
      if (element && container) {
        const rect = element.getBoundingClientRect();
        const targetScrollTop = container.scrollTop + rect.top;
        container.scrollTo({ top: targetScrollTop, behavior: "smooth" });
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#020203] text-zinc-300 font-sans antialiased scanline-bg selection:bg-cyan-500/20 selection:text-cyan-400 md:cursor-none relative"
    >
      
      {/* Deep Space Ambient Nebula Gas & Galactic Atmosphere Backplate */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#010103]">
        {/* Soft elegant gas clusters - multi-point gradients with breathing animation */}
        <div className="absolute inset-0 opacity-[0.25] mix-blend-screen bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.35)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(6,182,212,0.3)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.18)_0%,transparent_55%)] filter blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
        
        {/* Cyber technical mesh subtle lines */}
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
      </div>

      {/* Global Fixed 3D Low-Poly Cosmos Planet & Floating Space Walker Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-[0.88]">
        <ThreeCanvas scrollYProgress={scrollYProgress} />
      </div>

      {/* Persistent Aerospace CRT Terminal System Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
        {/* Phosphor micro-grid lines */}
        <div className="absolute inset-0 crt-phosphor-grid opacity-[0.38]" />
        
        {/* Ultra-subtle CRT terminal phosphor luminescence flicker */}
        <div className="absolute inset-0 bg-[#050505]/[0.015] crt-flicker-layer" />
        
        {/* Slow vertical system diagnostic sweep */}
        <div className="absolute top-0 left-0 right-0 h-48 crt-radar-sweep" />
      </div>

      {/* 0. Thin, high-performance telemetry scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 origin-left z-[100] shadow-[0_0_12px_rgba(34,211,238,0.8)]"
        style={{ scaleX }}
      />

      {/* Dynamic Aerospace Custom Vector Cursor */}
      <CustomCursor />

      {/* 1. Global fixed Navigation */}
      <GlobalNavigation />

      {/* 2. Unified Hero Viewport & Boot Sequence */}
      <div className="w-full min-h-screen relative z-20">
        <BootSequence scrollYProgress={scrollYProgress} />
      </div>

      {/* 3. Experience timeline (Enterprise Architecture) */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full min-h-screen relative z-20 bg-black/40 backdrop-blur-[2px] border-t border-zinc-900/40"
      >
        <EnterpriseArchitecture />
      </motion.div>

      {/* 3.5 Core Capabilities (Tech Stack) */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full relative z-20 bg-black/30 backdrop-blur-[2px] border-t border-zinc-900/40"
      >
        <TechStack />
      </motion.div>

      {/* 4. Projects Bento Box Grid (System Payloads) */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full min-h-screen relative z-20 bg-black/30 backdrop-blur-[2px] border-t border-zinc-900/40"
      >
        <SystemPayloads />
      </motion.div>

      {/* 5. Live Telemetry Chatbot Terminal */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full min-h-screen relative z-20 bg-black/40 backdrop-blur-[2px] border-t border-zinc-900/40"
      >
        <LiveTelemetryTerminal />
      </motion.div>

      {/* 5.5 Interactive Comms Uplink Contact Gateway Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="w-full relative z-20 bg-black/30 backdrop-blur-[2px] border-t border-zinc-900/40"
      >
        <ContactSection />
      </motion.div>

      {/* 6. Premium Crafted End of File Footer */}
      <footer className="bg-zinc-950/40 border-t border-zinc-900/80 py-16 px-6 md:px-12 font-mono text-xs select-none relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 items-center justify-center lg:justify-between w-full">
          
          {/* Left Column (Main Brand / Pitch) */}
          <div className="flex-1 lg:max-w-xl space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="font-mono text-cyan-400 text-[11px] tracking-widest uppercase mb-1 block">
              END_OF_FILE
            </span>
            <h3 className="text-3xl md:text-[40px] font-extrabold tracking-tighter text-white font-sans uppercase leading-[1.05] select-text">
              READY TO <span className="text-zinc-600 lg:text-zinc-600">DEPLOY</span><br />
              SOMETHING <span className="text-cyan-400">EXTRAORDINARY?</span>
            </h3>
            <p className="text-zinc-400 font-sans text-sm md:text-base leading-relaxed max-w-lg select-text">
              Open to deep-tech engineering roles • research collaborations • advisory. Operating from Chennai ➔ anywhere.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => {
                  if (typeof (window as any).scrollToSection === "function") {
                    (window as any).scrollToSection("contact");
                  }
                }}
                className="inline-block py-3.5 px-7 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold font-mono text-xs uppercase tracking-widest transition-all duration-300 select-none cursor-pointer"
              >
                [ INITIATE CONTACT ]
              </button>
            </div>
          </div>

          {/* Right Columns Cluster block */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-10 sm:gap-12 md:gap-16 items-center sm:items-start justify-center lg:justify-start">
            
            {/* Middle Column (Links) */}
            <div className="space-y-4 min-w-[200px] flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono justify-center sm:justify-start">
                <span className="text-zinc-600">▶</span> DIRECT_LINKS
              </h4>
              <ul className="space-y-3 font-mono text-[13px] text-zinc-400 flex flex-col items-center sm:items-start">
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                    <FileText size={14} className="text-zinc-600" />
                    <span>Resume (PDF)</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/jeevapravin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                    <Github size={14} className="text-zinc-600" />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/jeeva-pravin-2365aa279" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                    <Linkedin size={14} className="text-zinc-600" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:jeevapravinhere@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors duration-200 select-text">
                    <Mail size={14} className="text-zinc-600" />
                    <span>jeevapravinhere@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Right Column (Metrics) */}
            <div className="space-y-4 min-w-[220px] w-full sm:w-auto max-w-[280px] sm:max-w-none flex flex-col items-center sm:items-start">
              <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono justify-center sm:justify-start">
                <span className="text-zinc-600">▶</span> SYSTEM_META
              </h4>
              <div className="space-y-3 font-mono text-[11px] text-zinc-400 w-full sm:w-[220px]">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 gap-4">
                  <span className="text-zinc-500 uppercase tracking-wider">LOC</span>
                  <span className="text-zinc-300 font-bold">Chennai, IN</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 gap-4">
                  <span className="text-zinc-500 uppercase tracking-wider">TZ</span>
                  <span className="text-zinc-300 font-bold">UTC +05:30</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 gap-4">
                  <span className="text-zinc-500 uppercase tracking-wider">STATUS</span>
                  <span className="text-cyan-400 font-semibold uppercase">Building</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 gap-4">
                  <span className="text-zinc-500 uppercase tracking-wider">FOCUS</span>
                  <span className="text-zinc-300 text-[10px] text-right leading-tight">Agentic Systems<br/>Knowledge Engines</span>
                </div>
              </div>
            </div>

            {/* Decorative vertical spacer / vertical text column */}
            <div className="text-zinc-600 text-[9px] tracking-[0.3em] font-mono [writing-mode:vertical-rl] pl-4 border-l border-zinc-900 h-28 hidden lg:block uppercase select-none self-center">
              UPLINK • NOMINAL
            </div>

            {/* Futuristic developer hologram HUD card */}
            <div className="shrink-0 flex items-center justify-center self-center w-full sm:w-auto">
              <TiltedCard
                imageSrc="/images/jeeva-profile.jpg"
                altText="Jeeva Pravin"
                captionText=""
                imageHeight="100%"
                imageWidth="100%"
                containerHeight="240px"
                containerWidth="180px"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>

          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 uppercase tracking-wider text-center sm:text-left">
          <div>
            &copy; {currentYear} · JP // SYS ADMIN · ALL SYSTEMS NOMINAL
          </div>
          <div className="flex items-center gap-2">
            <span>HANDCRAFTED</span>
            <span className="text-zinc-700">•</span>
            <span>ZERO TEMPLATES</span>
            <span className="text-zinc-700">•</span>
            <span className="text-cyan-500/80">QX//SEC</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
