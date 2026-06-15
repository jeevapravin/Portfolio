import React, { useState } from "react";
import { TimelineEntry } from "../types";
import { Terminal, Calendar, Briefcase, ChevronRight, Activity, Cpu } from "lucide-react";
import { motion } from "motion/react";
import FuzzyText from "./FuzzyText";

export default function EnterpriseArchitecture() {
  const experiences: TimelineEntry[] = [
    {
      id: "neevcloud",
      role: "AI Engineering Intern",
      company: "NeevCloud",
      duration: "2026 - Present",
      summary: "Building AI-first developer infrastructure and agentic systems, focusing on intersecting developer tools and AI agents.",
      details: [
        "Developing a documentation platform inspired by GitBook and Mintlify for seamless software indexing.",
        "Engineering AI-powered developer experiences and Model Context Protocol (MCP) integrations.",
        "Working on NeevCode (an AI IDE built on OpenCode) and orchestrating complex multi-agent systems via skills-based workflows."
      ],
      systemLoad: "AGENTIC_NODE // ONLINE",
      metrics: [
        { label: "MCP INTEGRATION", value: "ACTIVE" },
        { label: "AGENT ORCHESTRATION", value: "NOMINAL" },
      ]
    },
    {
      id: "goalmind",
      role: "Winner - Multi-Agent Systems",
      company: "SRM Fastathon",
      duration: "2026",
      summary: "Developed GoalMind, a collaborative multi-agent decision-making system featuring adversarial debate layers.",
      details: [
        "Constructed an AI workforce consisting of Planner, Optimist, Skeptic, Risk Analyst, and Judge agents.",
        "Implemented Tree-of-Thought reasoning, parallel agent execution, and real-time streaming responses.",
        "Achieved 1st place overall, securing an exclusive internship opportunity through the project."
      ],
      systemLoad: "DEBATE_LAYER // RESOLVED",
      metrics: [
        { label: "PLACEMENT", value: "1ST OVERALL" },
        { label: "CONVERGENCE RATE", value: "94.2%" },
      ]
    },
    {
      id: "shell-ai",
      role: "Global Finalist",
      company: "Shell AI Hackathon",
      duration: "2025",
      summary: "Engineered ensemble machine learning models to predict critical fuel blend properties from complex chemical compositions.",
      details: [
        "Competed globally against thousands of participants, optimizing predictive models for precision.",
        "Ranked Top 25 globally across all submissions.",
        "Secured 1st place internally at Shiv Nadar University."
      ],
      systemLoad: "ENSEMBLE_ML // OPTIMIZED",
      metrics: [
        { label: "GLOBAL RANK", value: "TOP 25" },
        { label: "UNIVERSITY RANK", value: "1ST" },
      ]
    }
  ];

  const [activeEntry, setActiveEntry] = useState<string>("neevcloud");

  return (
    <section id="architecture" className="relative py-24 bg-transparent border-b border-zinc-800/60 font-sans">
      {/* Absolute Backdrop Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span>SYSTEM_NODE: EXPERIENCE_TIMELINE // ROOT_CHECK_LOGS</span>
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
              ENTERPRISE ARCHITECTURE
            </FuzzyText>
          </div>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-wide">
            VERIFIABLE SERVICE LOGS / OPERATIONAL CHRONICLE
          </p>
        </motion.div>

        {/* Timeline Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Log Selection Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-4 font-mono"
          >
            <div className="text-[11px] text-zinc-500 uppercase tracking-widest pl-2 mb-2 flex items-center gap-2">
              <Terminal size={12} className="text-zinc-500" /> ACTIVE_REGISTRY_ENTRIES
            </div>

            {experiences.map((exp) => {
              const isActive = activeEntry === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveEntry(exp.id)}
                  id={`timeline-btn-${exp.id}`}
                  className={`w-full text-left p-4 border transition-all duration-300 rounded-sm cursor-pointer relative group ${
                    isActive
                      ? "bg-zinc-900 border-zinc-700 shadow-[0_0_15px_-3px_rgba(251,191,36,0.1)]"
                      : "bg-[#09090b] border-zinc-800 hover:border-zinc-700/60"
                  }`}
                >
                  {/* Neon Amber Accent Indicator for Hover & Focus */}
                  {isActive && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500" />
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 border font-semibold ${
                          isActive ? "border-amber-500/30 text-amber-500 bg-amber-500/5" : "border-zinc-800 text-zinc-500 bg-zinc-950"
                        }`}>
                          {exp.duration}
                        </span>
                        <span className="text-zinc-500 text-[10px]">({exp.systemLoad})</span>
                      </div>
                      <h3 className="text-white font-medium text-sm mt-2 transition-colors duration-200 group-hover:text-amber-400">
                        {exp.role} @ {exp.company}
                      </h3>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-300 ${
                        isActive ? "text-amber-500 transform translate-x-1" : "text-zinc-700"
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {/* Diagnostic system summary card below choices */}
            <div className="border border-zinc-800 bg-[#09090b]/80 p-4 rounded-sm text-zinc-500 text-[11px] leading-relaxed space-y-2">
              <div className="text-zinc-400 flex items-center gap-1.5 uppercase font-semibold">
                <Cpu size={12} className="text-zinc-500" /> Telemetry Validation Status
              </div>
              <p>Node path verification initialized against commercial registers. Fully compliant with enterprise-grade decentralized access parameters.</p>
              <div className="text-[10px] text-zinc-600 font-mono">MD5_CHECKSUM: D41D8CD98F00B204E9800998ECF8427E</div>
            </div>
          </motion.div>

          {/* Right Column: High-fidelity Log Details Screen */}
          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7"
          >
            {experiences.map((exp) => {
              if (exp.id !== activeEntry) return null;
              return (
                <div
                  key={exp.id}
                  className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-6 md:p-8 rounded-sm font-sans space-y-6 relative"
                >
                  {/* Subtle Design Accents */}
                  <div className="absolute top-0 right-0 p-3 text-[10px] text-zinc-600 font-mono">
                    LOG_STATE // SECURE_COMM
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1 border-b border-zinc-800 pb-5">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                      <Briefcase size={14} className="text-amber-500" />
                      {exp.id === "neevcloud" ? (
                        <a href="https://neevcloud.com?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                          {exp.company}
                        </a>
                      ) : (
                        <span>{exp.company}</span>
                      )}
                      <span className="text-zinc-600">//</span>
                      <Calendar size={14} />
                      <span>{exp.duration}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                      {exp.role}
                    </h3>
                  </div>

                  {/* Operational Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      [ MISSION DIRECTIVE ]
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed select-text">
                      {exp.summary}
                    </p>
                  </div>

                  {/* Execution Steps */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      [ EXECUTED PIPELINES ]
                    </h4>
                    <ul className="space-y-2">
                      {exp.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-zinc-400 select-text">
                          <span className="text-amber-500 font-mono text-xs mt-1">▸</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics Diagnostics Panel */}
                  <div className="border-t border-zinc-800 pt-5 mt-6 grid grid-cols-2 gap-4">
                    {exp.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-[#050505] border border-zinc-800 p-3 rounded-sm font-mono text-center">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
                          {metric.label}
                        </div>
                        <div className="text-base font-bold text-white mt-1">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
