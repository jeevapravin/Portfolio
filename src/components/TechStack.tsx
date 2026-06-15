import React from "react";
import { Cpu, Terminal, Layers, Server } from "lucide-react";
import { motion } from "motion/react";
import FuzzyText from "./FuzzyText";

export default function TechStack() {
  const techCategories = [
    {
      title: "Edge AI & ML",
      icon: <Cpu size={16} className="text-amber-500" />,
      items: ["TensorRT", "ONNX Runtime", "PyTorch", "TensorFlow Lite"],
      status: "OPTIMIZED",
    },
    {
      title: "Core Languages",
      icon: <Terminal size={16} className="text-cyan-400" />,
      items: ["C++", "Python", "TypeScript", "Go"],
      status: "FLUENT",
    },
    {
      title: "Systems & Infra",
      icon: <Server size={16} className="text-purple-400" />,
      items: ["Docker", "Kubernetes", "Linux / Unix", "AWS / GCP"],
      status: "NOMINAL",
    },
    {
      title: "Frameworks & Tools",
      icon: <Layers size={16} className="text-emerald-400" />,
      items: ["React", "Vite", "Git", "ROS 2"],
      status: "ACTIVE",
    },
  ];

  return (
    <section id="tech-stack" className="relative py-24 bg-transparent border-b border-zinc-800/60 font-sans">
      {/* Absolute Backdrop Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>SYSTEM_NODE: CORE_CAPABILITIES // TECH_STACK_SCAN</span>
          </div>
          <div className="select-text">
            <FuzzyText
              fontSize="clamp(1.8rem, 4.8vw, 3rem)"
              fontWeight={800}
              color="#ffffff"
              enableHover={true}
              baseIntensity={0.06}
              hoverIntensity={0.4}
              fuzzRange={15}
              glitchMode={true}
              glitchInterval={6000}
              glitchDuration={200}
              className="font-extrabold font-sans uppercase block"
              style={{
                marginLeft: "-35px",
                marginTop: "-6px",
              }}
            >
              CORE TECHNOLOGIES
            </FuzzyText>
          </div>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-wide">
            PRIMARY ARSENAL / DEPLOYMENT READY
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-[#09090b]/80 border border-zinc-800 p-6 rounded-sm hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 border border-zinc-800/80 rounded-sm">
                    {category.icon}
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
              </div>

              <ul className="space-y-3 font-mono text-xs text-zinc-400">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group/item">
                    <span className="text-zinc-700 group-hover/item:text-cyan-500 transition-colors duration-300">▹</span>
                    <span className="group-hover/item:text-zinc-200 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[10px]">
                <span className="text-zinc-600 uppercase">SYS_STATUS</span>
                <span className="text-cyan-500/80 font-semibold tracking-wider">[{category.status}]</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
