import React, { useState, useEffect } from "react";
import { PayloadProject } from "../types";
import { Network, Workflow, Map, Search, Terminal, Radio, Shield, HelpCircle, Activity, Sun, Battery, X } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate, AnimatePresence } from "motion/react";
import FuzzyText from "./FuzzyText";

interface InteractiveCardProps {
  id: string;
  className: string;
  initial?: any;
  whileInView?: any;
  viewport?: any;
  transition?: any;
  spotlightColor?: string;
  laserColor?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  key?: string | number;
}

function InteractiveCard({
  id,
  className,
  initial,
  whileInView,
  viewport,
  transition,
  spotlightColor = "rgba(34, 211, 238, 0.12)",
  laserColor = "#22d3ee",
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Highly responsive 3D tilt limits (8 degrees max tilt for gorgeous physical reaction)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  // Subtle magnetic pull (8px translation in all axes)
  const transX = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const transY = useTransform(y, [-0.5, 0.5], [-8, 8]);

  // Dynamic scale spring on hover (extremely fast and modern)
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { damping: 30, stiffness: 600 });

  // Extremely responsive high-frequency springs for immediate tracking
  const springRotateX = useSpring(rotateX, { damping: 35, stiffness: 800 });
  const springRotateY = useSpring(rotateY, { damping: 35, stiffness: 800 });
  const springTransX = useSpring(transX, { damping: 35, stiffness: 800 });
  const springTransY = useSpring(transY, { damping: 35, stiffness: 800 });

  // Dynamically assemble the transformations using useMotionTemplate
  const transform = useMotionTemplate`perspective(1200px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) translateX(${springTransX}px) translateY(${springTransY}px) scale(${springScale})`;

  // Spotlight progress mapped coordinates (from -0.5..0.5 to 0..100)
  const spotlightX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const spotlightY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${spotlightX}% ${spotlightY}%, ${spotlightColor} 0%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
    scale.set(1.025);
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <motion.div
      id={id}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      onClick={onClick}
      className={`${className} overflow-hidden cursor-pointer relative`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Dynamic Scan Line on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ y: "-10%" }}
            animate={{ y: "110%" }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute left-0 right-0 h-[1.5px] z-20 pointer-events-none opacity-45 animate-pulse"
            style={{
              background: `linear-gradient(to right, transparent, ${laserColor}, transparent)`,
              boxShadow: `0 0 10px 2px ${laserColor}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Cyber Grid dot background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none group-hover:bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] transition-[background] duration-500 z-0" />

      {/* Real-time Dynamic Spotlight Flare Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{ background: spotlightBg }}
      />

      {/* HUD-style corner brackets replacing dots */}
      <div
        className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-zinc-800 transition-all duration-300 z-10 pointer-events-none group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]"
        style={{ borderColor: isHovered ? laserColor : undefined }}
      />
      <div
        className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-zinc-800 transition-all duration-300 z-10 pointer-events-none group-hover:translate-x-[1px] group-hover:translate-y-[-1px]"
        style={{ borderColor: isHovered ? laserColor : undefined }}
      />
      <div
        className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-zinc-800 transition-all duration-300 z-10 pointer-events-none group-hover:translate-x-[-1px] group-hover:translate-y-[1px]"
        style={{ borderColor: isHovered ? laserColor : undefined }}
      />
      <div
        className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-zinc-800 transition-all duration-300 z-10 pointer-events-none group-hover:translate-x-[1px] group-hover:translate-y-[1px]"
        style={{ borderColor: isHovered ? laserColor : undefined }}
      />

      <div
        className="w-full h-full flex flex-col justify-between relative z-10"
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function SystemPayloads() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // GoalMind active debate step simulator
  const [debateStep, setDebateStep] = useState(0);
  const debateLogs = [
    { agent: "Optimist Agent", text: "Goal objective fully actionable. Estimated convergence rate: 94.2%.", color: "text-emerald-400" },
    { agent: "Skeptic Agent", text: "Flagging edge-case latency on remote Tailscale routing index node.", color: "text-yellow-500" },
    { agent: "Risk Analyst", text: "Resource utilization exceeds limits on edge thread, throttle required.", color: "text-rose-500" },
    { agent: "Judge Agent", text: "Compiling aggregate vector weights. Dispatching executable task sequence.", color: "text-cyan-400" },
  ];

  // Routing Telemetry Coordinates simulator for Pulse-Chennai
  const [currentCoords, setCurrentCoords] = useState({ lat: 13.0827, lng: 80.2707, speed: "52 km/h", eta: "12 mins" });

  // Knowledge OS nodes simulator
  const [activeNodes, setActiveNodes] = useState([
    { id: "OLLAMA_CORE_0", status: "STABLE", load: "42%" },
    { id: "QDRANT_NODE_1", status: "NOMINAL", load: "28%" },
    { id: "TAILSCALE_MESH_2", status: "ROUTING", load: "11%" },
  ]);

  // Hydra-Guard packet monitor logs state simulator
  const [packetLogs, setPacketLogs] = useState<string[]>([
    "SYS_INIT // Socket filters attached cleanly to eth0",
    "ALLOW // TLS Peer Handshake 172.16.42.109 -> LOCAL:443",
    "DECOY // Rerouted unsolicited ping to honey subnet ID:8",
  ]);

  // Helios-Dune solar battery statistics live stream simulator
  const [solarTelemetry, setSolarTelemetry] = useState({
    battery: 89.2,
    solarInput: 42.6,
    mpptStatus: "CHARGING",
    loraSignal: -86,
  });

  useEffect(() => {
    // Debate step interval
    const debateInterval = setInterval(() => {
      setDebateStep((prev) => (prev + 1) % debateLogs.length);
    }, 3200);

    // Coordinate and environment streams at 1Hz
    const telemetryInterval = setInterval(() => {
      setCurrentCoords({
        lat: Number((13.08 + Math.random() * 0.01).toFixed(4)),
        lng: Number((80.27 + Math.random() * 0.02).toFixed(4)),
        speed: `${Math.floor(48 + Math.random() * 12)} km/h`,
        eta: `${Math.floor(9 + Math.random() * 4)} mins`,
      });

      // Knowledge OS node loads shifting slightly
      setActiveNodes((prev) =>
        prev.map((node) => ({
          ...node,
          load: `${Math.floor(15 + Math.random() * 60)}%`,
        }))
      );

      // Hydra-guard logs updating
      const ips = ["192.168.1.182", "172.16.42.92", "104.244.42.21", "185.190.140.23"];
      const messages = [
        "DROP // Heavy Syn-Flood packet match",
        "BLOCK // Portscan attempt from anomalous peer",
        "ALLOW // Remote Tailscale connection accepted",
        "LOG // Decrypted secure mesh sync packet",
      ];
      setPacketLogs((prev) => {
        const nextIp = ips[Math.floor(Math.random() * ips.length)];
        const nextMsg = messages[Math.floor(Math.random() * messages.length)];
        const updated = [`${nextMsg} [${nextIp}]`, prev[0], prev[1]];
        return updated.slice(0, 3);
      });

      // Helios Solar stats drift
      setSolarTelemetry((prev) => ({
        battery: Number(Math.min(100, Math.max(0, prev.battery + (Math.random() > 0.5 ? 0.05 : -0.05))).toFixed(2)),
        solarInput: Number(Math.max(10, prev.solarInput + (Math.random() > 0.5 ? 0.8 : -0.8)).toFixed(1)),
        mpptStatus: Math.random() > 0.85 ? "FLOAT_MAINTENANCE" : "CHARGING",
        loraSignal: Math.floor(-88 + Math.random() * 5),
      }));
    }, 1000);

    return () => {
      clearInterval(debateInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  const projectsData = [
    {
      id: "knowledge-os",
      title: "KnowledgeOS",
      category: "Semantic Search / Personal AI Cloud",
      badge: "NODE_A1 // ACTIVE",
      teaser: "A fully self-hosted knowledge system running on a shared laptop 400km away. Built to solve 'I know the file exists, I just don't know where'.",
      description: "KnowledgeOS continuously watches documents, generates embeddings locally, builds a knowledge graph, and enables semantic retrieval from anywhere through natural language. Started from learning SSH and evolved into a personal AI cloud, semantic search engine, and distributed storage layer. Boot sequence mounts storage, activates file watchers, runs embedding pipelines, and exposes a Search API.",
      cost: "Self-Hosted // ₹0/month",
      link: "https://github.com/jeevapravin",
      tech: ["Ollama", "Qdrant", "Tailscale", "Embeddings", "Knowledge Graph"],
      spotlight: "rgba(34, 211, 238, 0.15)",
      laserColor: "#22d3ee",
      gridClass: "lg:col-span-8 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-[#22d3ee]/60 hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.2)]",
      icon: <Network size={20} className="text-cyan-400" />,
      visualType: "knowledge-os",
    },
    {
      id: "goalmind",
      title: "GoalMind",
      category: "Multi-Agent System / Adversarial Debate",
      badge: "SRM Fastathon Winner",
      teaser: "Instead of one model generating answers, GoalMind creates an AI workforce of specialized agents collaborating to solve problems.",
      description: "A collaborative decision-making system featuring Tree-of-Thought reasoning, parallel agent execution, and real-time streaming responses. Specialized agents (Planner, Optimist, Skeptic, Risk Analyst, Judge) debate and challenge assumptions. The project secured 1st place overall at the SRM Fastathon and led to an exclusive internship opportunity.",
      cost: "Winner // Fastathon",
      link: "https://github.com/jeevapravin",
      tech: ["Tree-of-Thought", "Multi-Agent Debate", "Web-Grounded Research", "Parallel Execution"],
      spotlight: "rgba(245, 158, 11, 0.15)",
      laserColor: "#fbbf24",
      gridClass: "lg:col-span-4 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-[#fbbf24]/60 hover:shadow-[0_0_25px_-5px_rgba(251,191,36,0.2)]",
      icon: <Workflow size={20} className="text-amber-500" />,
      visualType: "goalmind",
    },
    {
      id: "transit-intelligence",
      title: "Transit Intelligence",
      category: "Graph-Based ETA & Ride Matching",
      badge: "SPATIAL ENGINE",
      teaser: "Inspired by 'How does Uber know when your driver arrives?', built a distributed ride matching and ETA prediction system.",
      description: "A comprehensive backend spatial engine utilizing Dijkstra Routing and OpenStreetMap graphs to compute accurate driver matching. Leverages Uber H3 Spatial Indexing and machine learning for ETA predictions and real-time tracking across complex metropolitan traffic arrays.",
      cost: "OpenStreetMap Graphs",
      link: "https://github.com/jeevapravin",
      tech: ["Dijkstra Routing", "Uber H3 Indexing", "Geospatial ML", "ETA Prediction"],
      spotlight: "rgba(16, 185, 129, 0.15)",
      laserColor: "#10b981",
      gridClass: "lg:col-span-4 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-emerald-500/60 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]",
      icon: <Map size={20} className="text-emerald-400" />,
      visualType: "pulse-chennai",
    },
    {
      id: "shell-ai",
      title: "Shell AI Hackathon",
      category: "Ensemble ML Property Prediction",
      badge: "TOP 25 GLOBAL",
      teaser: "Built ensemble machine learning models capable of predicting critical fuel blend properties from complex chemical compositions.",
      description: "Competed against thousands of participants worldwide to construct highly robust predictive models. The ensemble ML architecture successfully mapped non-linear chemical features to fuel blend properties, achieving a Top 25 Global Ranking and securing 1st place internally at Shiv Nadar University.",
      cost: "Global Finalist",
      link: "https://github.com/jeevapravin",
      tech: ["Ensemble ML", "Feature Engineering", "Chemical Properties", "Regression Models"],
      spotlight: "rgba(34, 211, 238, 0.15)",
      laserColor: "#22d3ee",
      gridClass: "lg:col-span-4 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-cyan-400/60 hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.2)]",
      icon: <Search size={20} className="text-cyan-300" />,
      visualType: "svd-projection",
    },
    {
      id: "wifi-tracker",
      title: "WiFi Tracker",
      category: "Wireless Presence Detection System",
      badge: "PACKET ANALYZER",
      teaser: "A network intelligence project designed to monitor nearby devices through WiFi signals and analyze physical movement patterns.",
      description: "Built to explore real-world networking, passive tracking systems, and device discovery protocols. Analyzes wireless beacon frames and probe requests to map local device presence over time via automated packet capture scripts.",
      cost: "Passive Monitoring",
      link: "https://github.com/jeevapravin",
      tech: ["Python", "Networking", "Packet Analysis", "WiFi Monitoring", "Automation"],
      spotlight: "rgba(239, 68, 68, 0.15)",
      laserColor: "#ef4444",
      gridClass: "lg:col-span-4 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-rose-500/60 hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.2)]",
      icon: <Shield size={20} className="text-rose-400" />,
      visualType: "hydra-guard",
    },
    {
      id: "hardware-lab",
      title: "Hardware Lab",
      category: "Where Software Meets Sensors",
      badge: "PROTOTYPES",
      teaser: "A collection of physical hardware projects including autonomous robots, smart appliances, and IoT sensors.",
      description: "GroundBot: Autonomous fertilizer spraying robot (Smart India Hackathon). SipSense: Smart water bottle monitoring hydration. Smart Stove: Detects flame failure, cuts gas flow, learns cooking patterns. Voice-Protected Dustbin: Opens only for human voice commands. And many more experimental prototypes.",
      cost: "Hardware Dev Lab",
      link: "https://github.com/jeevapravin",
      tech: ["IoT Sensors", "Robotics", "Hardware Assembly", "Embedded Logic", "Actuators"],
      spotlight: "rgba(168, 85, 247, 0.15)",
      laserColor: "#a855f7",
      gridClass: "lg:col-span-12 border border-zinc-800 bg-[#0c0c0e]/95 hover:border-purple-500/60 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.2)]",
      icon: <Activity size={20} className="text-purple-400" />,
      visualType: "helios-dune",
    },
  ];

  // Helper function to render active simulation streams based on type in the modal details block
  const renderInteractiveSim = (type: string) => {
    switch (type) {
      case "knowledge-os":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono uppercase mb-4 pb-2 border-b border-zinc-800/80">
              <span>Distributed Compute Nodes Status</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <Radio size={11} className="animate-pulse" /> RT-Link: Active
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs text-zinc-300">
              {activeNodes.map((node) => (
                <div key={node.id} className="bg-[#050507] border border-zinc-900 px-4 py-3 rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">NODE_IDENTIFIER</span>
                    <span className="text-white font-semibold">{node.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 text-[11px] font-bold block">{node.status}</span>
                    <span className="text-[10px] text-zinc-400">Load: {node.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "goalmind":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono uppercase mb-4 pb-2 border-b border-zinc-800/80">
              <span>Concurrent Debate Module</span>
              <span className="text-amber-500 animate-pulse font-bold">● RUNTIME ACTIVE</span>
            </div>
            <div className="bg-[#050507] border border-zinc-900 p-4 rounded-sm space-y-4">
              <div className="text-[11px] leading-relaxed">
                <span className={`font-bold ${debateLogs[debateStep].color}`}>
                  [{debateLogs[debateStep].agent}]
                </span>
                <span className="text-zinc-500 ml-1">@ {new Date().toLocaleTimeString()}</span>
                <p className="text-zinc-300 mt-2 font-mono border-l-2 border-zinc-800 pl-3 italic">
                  "{debateLogs[debateStep].text}"
                </p>
              </div>
              <div className="border-t border-zinc-900 pt-3 flex gap-2 items-center text-[10px] text-zinc-500">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                <span>Synchronizing decision matrices...</span>
              </div>
            </div>
          </div>
        );

      case "pulse-chennai":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex justify-between text-zinc-500 text-[11px] uppercase border-b border-zinc-800/80 pb-2 mb-4 font-bold">
              <span>Geospatial Stream Telemetry</span>
              <span className="text-emerald-400 animate-pulse">● 1Hz ACTIVE</span>
            </div>
            <div className="bg-[#050507] border border-zinc-900 p-4 rounded-sm space-y-3">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500 text-[10px]">COORDINATE AXES</span>
                <span className="text-white font-bold">{currentCoords.lat} N, {currentCoords.lng} E</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-500 text-[10px]">VEHICLE SPEED</span>
                <span className="text-emerald-400 font-bold">{currentCoords.speed}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-zinc-500 text-[10px]">COMPUTED ETA</span>
                <span className="text-amber-400 font-bold">{currentCoords.eta}</span>
              </div>
            </div>
          </div>
        );

      case "hydra-guard":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex justify-between text-zinc-500 text-[11px] uppercase border-b border-zinc-800/80 pb-2 mb-4 font-bold">
              <span>eBPF Filter Packet Dropper Logs</span>
              <span className="text-rose-400 animate-pulse">● RT SHIELD STREAM</span>
            </div>
            <div className="bg-[#050507] border border-zinc-900 p-4 rounded-sm space-y-2 h-[120px] overflow-hidden">
              {packetLogs.map((log, idx) => {
                const isDrop = log.includes("DROP") || log.includes("BLOCK");
                return (
                  <div key={idx} className="flex gap-2 text-[11px] leading-tight select-all">
                    <span className={isDrop ? "text-rose-500 font-bold" : "text-emerald-400 font-bold"}>
                      &gt;
                    </span>
                    <span className={isDrop ? "text-zinc-300" : "text-zinc-400"}>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "helios-dune":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex justify-between text-zinc-500 text-[11px] uppercase border-b border-zinc-800/80 pb-2 mb-4 font-bold">
              <span>Off-Grid Node Solar Telemetry</span>
              <span className="text-purple-400 animate-pulse">● LoRa GRID BROADCAST</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#050507] border border-zinc-900 p-3 rounded-sm">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] uppercase mb-1">
                  <Battery size={12} className="text-purple-400" /> State of Charge
                </div>
                <div className="text-lg font-bold text-white">{solarTelemetry.battery}%</div>
              </div>
              <div className="bg-[#050507] border border-zinc-900 p-3 rounded-sm">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] uppercase mb-1">
                  <Sun size={12} className="text-yellow-500" /> PV Solar Input
                </div>
                <div className="text-lg font-bold text-yellow-400">{solarTelemetry.solarInput}W</div>
              </div>
              <div className="bg-[#050507] border border-zinc-900 p-3 rounded-sm col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 text-[9px] block uppercase">MPPT STATE</span>
                  <span className="text-purple-400 text-xs font-bold">{solarTelemetry.mpptStatus}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 text-[9px] block uppercase">RSSI SIGNAL</span>
                  <span className="text-white text-xs font-bold">{solarTelemetry.loraSignal} dBm</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "svd-projection":
        return (
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-5 rounded-md font-mono text-xs">
            <div className="flex justify-between text-zinc-500 text-[11px] uppercase border-b border-zinc-800/80 pb-2 mb-4 font-bold">
              <span>CLIP deconvolution space metrics</span>
              <span className="text-cyan-400 animate-pulse">● SVD PROJECTION</span>
            </div>
            <div className="bg-[#050507] border border-zinc-900 p-4 rounded-sm space-y-3.5 select-all text-[11px]">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Singular Matrix Diagonals (Σ_diag):</span>
                <div className="text-cyan-400/90 font-semibold bg-zinc-950/80 p-1.5 rounded border border-zinc-900 mt-1 select-all overflow-x-auto whitespace-nowrap">
                  [1.285e-01, 8.491e-02, 3.104e-03, 1.492e-06]
                </div>
              </div>
              <div className="flex justify-between text-zinc-400 text-[10px]">
                <span>PROJECTION RANK: 4</span>
                <span className="text-cyan-400 font-bold">COGNITIVE_BIAS_DROPPED</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedProject = projectsData.find((p) => p.id === selectedProjectId);

  return (
    <section id="payloads" className="relative py-24 bg-transparent border-b border-zinc-800/60 font-sans">
      {/* Absolute Backdrop Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>PROJECT_REGISTRY // EDGE_PAYLOADS_v3.0</span>
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
              SYSTEM PAYLOADS
            </FuzzyText>
          </div>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-wide">
            Asymmetrical bento-grid detailing active projects & core research
          </p>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {projectsData.map((project, idx) => {
            const isHovered = hoveredProjectId === project.id;
            return (
              <InteractiveCard
                key={project.id}
                id={`card-${project.id}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                spotlightColor={project.spotlight}
                laserColor={project.laserColor}
                onClick={() => setSelectedProjectId(project.id)}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className={`${project.gridClass} p-6 rounded-md relative overflow-hidden group transition-colors duration-200 flex flex-col justify-between`}
                style={{
                  borderColor: isHovered ? project.laserColor + '80' : 'rgba(39, 39, 42, 0.4)',
                  boxShadow: isHovered ? `0 0 30px -5px ${project.laserColor}25` : undefined,
                }}
              >
                {/* Card Header (Category + Status Marker) */}
                <div 
                  className="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5 mb-4 select-none font-mono text-[10px] transition-colors duration-300"
                  style={{ borderColor: isHovered ? project.laserColor + '25' : 'rgba(39, 39, 42, 0.4)' }}
                >
                  <span className="tracking-wider uppercase transition-colors duration-300"
                        style={{ color: isHovered ? project.laserColor : '#71717a' }}>
                    [{project.category}]
                  </span>
                  <span className="text-[9px] font-bold bg-zinc-950 px-1.5 py-0.5 border rounded-sm transition-all duration-300"
                        style={{ 
                          color: isHovered ? '#fff' : project.laserColor + 'cc', 
                          borderColor: isHovered ? project.laserColor : project.laserColor + '30',
                          backgroundColor: isHovered ? project.laserColor + '15' : 'transparent'
                        }}>
                    {project.badge}
                  </span>
                </div>

                {/* Card Body (Condensed teaser) */}
                <div className="space-y-3.5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-950 border rounded transition-all duration-300"
                         style={{ 
                           borderColor: isHovered ? project.laserColor + '50' : 'rgba(39, 39, 42, 0.8)',
                           boxShadow: isHovered ? `0 0 12px ${project.laserColor}20` : undefined,
                           transform: isHovered ? 'scale(1.08) rotate(6deg)' : 'none'
                         }}>
                      {project.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold tracking-tight transition-colors duration-300"
                          style={{ color: isHovered ? project.laserColor : '#ffffff' }}>
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed select-text transition-colors duration-300"
                     style={{ color: isHovered ? '#e4e4e7' : '#a1a1aa' }}>
                    {project.teaser}
                  </p>
                </div>

                {/* Bottom Interactive Prompt (Click triggers popping detail) */}
                <div 
                  className="pt-3 border-t flex justify-between items-center font-mono text-[10px] transition-colors duration-300"
                  style={{ borderColor: isHovered ? project.laserColor + '25' : 'rgba(39, 39, 42, 0.4)' }}
                >
                  <span className="transition-colors duration-300" style={{ color: isHovered ? '#a1a1aa' : '#52525b' }}>
                    EST_FEE: <strong className="transition-colors duration-300" style={{ color: isHovered ? '#ffffff' : '#71717a' }}>{project.cost}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 transition-all duration-300 font-bold tracking-wider"
                        style={{ color: isHovered ? project.laserColor : 'rgba(113, 113, 122, 0.7)' }}>
                    {isHovered ? "CLICK FOR FULL DOSSIER" : "CLICK FOR DETAILS"}
                    <motion.span
                      animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{ repeat: isHovered ? Infinity : 0, duration: 1.2, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </span>
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </div>

      {/* Dynamic Pop-up Decryption Modals for full project records */}
      <AnimatePresence>
        {selectedProjectId && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onPointerDown={() => setSelectedProjectId(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Main Pop Card Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-4xl bg-[#09090b]/98 border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[85vh] md:max-h-[750px] pointer-events-auto"
            >
              {/* Left Column: Comprehensive Details */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-800/60">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{selectedProject.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3.5xl font-extrabold tracking-tighter text-white mb-4">
                    {selectedProject.title}
                  </h3>

                  <div className="text-zinc-300 text-sm leading-relaxed space-y-4 pr-1 select-text">
                    <p>{selectedProject.description}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-900 space-y-4">
                  <div>
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-2">Technology Stack Matrix</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tech.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] bg-cyan-950/25 text-cyan-400 border border-cyan-800/20 px-2 py-0.5 rounded-sm uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-zinc-400 bg-zinc-950/50 border border-zinc-900 p-3 rounded-sm">
                    <span>GRID_COST: <strong className="text-white">{selectedProject.cost}</strong></span>
                    <span>DEPLOY_STATUS: <strong className="text-emerald-400">NOMINAL</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Simulators and Close control */}
              <div className="w-full md:w-[350px] bg-zinc-950/40 p-6 flex flex-col justify-between overflow-y-auto relative min-h-[220px]">
                {/* Close Button top corner */}
                <button
                  onClick={() => setSelectedProjectId(null)}
                  className="absolute top-4 right-4 p-1.5 border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-400/40 rounded transition-colors duration-200"
                  aria-label="Close details"
                >
                  <X size={15} />
                </button>

                <div className="mt-6 md:mt-2 space-y-4 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal size={14} className="text-cyan-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      Runtime Simulation Sandbox
                    </span>
                  </div>

                  {renderInteractiveSim(selectedProject.visualType)}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/60 font-mono text-[9px] text-zinc-500 text-center uppercase tracking-wide">
                  <span>AES_256 // [ESC] key to exit viewer</span>
                </div>
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2.5 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-800/50 hover:border-cyan-400 text-cyan-400 text-[11px] font-bold font-mono tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <span>LAUNCH_PAYLOAD</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
