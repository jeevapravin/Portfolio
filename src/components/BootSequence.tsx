import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform, useSpring, useScroll } from "motion/react";
import { Cpu, Server, Activity } from "lucide-react";
import FuzzyText from "./FuzzyText";

export default function BootSequence({ scrollYProgress }: { scrollYProgress?: any }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [booting, setBooting] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cores: "08/08",
    temp: "42.5°C",
    mem: "1.2 GB / 16 GB",
    linkQuality: "99.8%",
    threadRate: "788 Hz",
  });

  const { scrollYProgress: fallbackScroll } = useScroll();
  const activeScroll = scrollYProgress || fallbackScroll;

  // Distant Layer: Background grid shifts slightly
  const gridY = useTransform(activeScroll, [0, 0.25], [0, -50]);
  const gridOpacity = useTransform(activeScroll, [0, 0.25], [0.4, 0.15]);
  const springGridY = useSpring(gridY, { stiffness: 90, damping: 20 });
  const springGridOpacity = useSpring(gridOpacity, { stiffness: 90, damping: 20 });

  // Mid Layer: Math LiDAR Canvas shifts slightly faster and scales
  const canvasY = useTransform(activeScroll, [0, 0.25], [0, -100]);
  const canvasScale = useTransform(activeScroll, [0, 0.25], [1, 1.06]);
  const canvasOpacity = useTransform(activeScroll, [0, 0.25], [1.0, 0.4]);
  const springCanvasY = useSpring(canvasY, { stiffness: 90, damping: 20 });
  const springCanvasScale = useSpring(canvasScale, { stiffness: 90, damping: 20 });
  const springCanvasOpacity = useSpring(canvasOpacity, { stiffness: 90, damping: 20 });

  // Intermediary decorative visual radar layer
  const dialY = useTransform(activeScroll, [0, 0.25], [0, -150]);
  const dialRotate = useTransform(activeScroll, [0, 0.25], [0, 60]);
  const dialOpacity = useTransform(activeScroll, [0, 0.25], [0.12, 0]);
  const springDialY = useSpring(dialY, { stiffness: 90, damping: 20 });
  const springDialRotate = useSpring(dialRotate, { stiffness: 90, damping: 20 });
  const springDialOpacity = useSpring(dialOpacity, { stiffness: 90, damping: 20 });

  // Foreground: Content text column shifts up to get out of the way elegant
  const contentY = useTransform(activeScroll, [0, 0.25], [0, -120]);
  const springContentY = useSpring(contentY, { stiffness: 90, damping: 20 });

  // Sidebar / Right metrics panel shifts fastest
  const rightColY = useTransform(activeScroll, [0, 0.25], [0, -180]);
  const rightColOpacity = useTransform(activeScroll, [0, 0.22], [1, 0]);
  const springRightColY = useSpring(rightColY, { stiffness: 90, damping: 20 });
  const springRightColOpacity = useSpring(rightColOpacity, { stiffness: 90, damping: 20 });

  // Telemetry loop for real-time look
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemMetrics({
        cores: "08/08",
        temp: `${(41.2 + Math.random() * 2.1).toFixed(1)}°C`,
        mem: `${(1.15 + Math.random() * 0.1).toFixed(2)} GB / 16 GB`,
        linkQuality: `${(99.4 + Math.random() * 0.5).toFixed(1)}%`,
        threadRate: `${Math.floor(775 + Math.random() * 25)} Hz`,
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Boot log sequence
  useEffect(() => {
    const logs = [
      "SYSTEM INIT: [JPCORE v2.5.0]",
      "KERNEL: Directives-active // Security mode: SECURE",
      "CORE NODE DETECT: RTX-3050 Accelerator detected (READY)",
      "GRID CONFIG: Fetching Uber H3 hierarchical indexes...",
      "MESH DIAGNOSTIC: Tailscale virtual backplane link test...",
      "MESH DIAGNOSTIC: Latency is 18.2ms (STABLE)",
      "VECTOR BUFFER: Initializing Qdrant client connection (Localhost:6333)",
      "AGENT LINK: Loading Gemini 3.5-Flash context pathways...",
      "STATUS: IGNITION NOMINAL."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLog((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
        }, 1000); // Hold for visual appreciation
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Legacy 2D Canvas projection commented out in favor of 3D WebGL ThreeCanvas
  /*
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Starfield representation for immersive depth
    const stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1400,
        z: Math.random() * 800,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.4 + 0.3,
      });
    }

    // Realistic Continental Latitudes and Longitudes (Spherical Mesh Polygons)
    const continents = [
      // North America
      [
        { lat: 72, lon: -110 }, { lat: 68, lon: -100 }, { lat: 60, lon: -60 }, { lat: 50, lon: -55 },
        { lat: 45, lon: -65 }, { lat: 35, lon: -75 }, { lat: 25, lon: -80 }, { lat: 18, lon: -95 },
        { lat: 15, lon: -92 }, { lat: 9, lon: -82 }, { lat: 15, lon: -100 }, { lat: 25, lon: -110 },
        { lat: 33, lon: -118 }, { lat: 42, lon: -124 }, { lat: 55, lon: -130 }, { lat: 65, lon: -150 },
        { lat: 70, lon: -160 }
      ],
      // South America
      [
        { lat: 12, lon: -72 }, { lat: 6, lon: -54 }, { lat: -5, lon: -35 }, { lat: -18, lon: -38 },
        { lat: -34, lon: -58 }, { lat: -54, lon: -68 }, { lat: -55, lon: -72 }, { lat: -42, lon: -74 },
        { lat: -22, lon: -71 }, { lat: -10, lon: -76 }, { lat: -3, lon: -81 }, { lat: 8, lon: -78 }
      ],
      // Eurasia (Europe + Asia combined)
      [
        { lat: 75, lon: 35 }, { lat: 71, lon: 15 }, { lat: 60, lon: 10 }, { lat: 55, lon: -5 },
        { lat: 48, lon: -5 }, { lat: 44, lon: -10 }, { lat: 38, lon: -10 }, { lat: 36, lon: -4 },
        { lat: 40, lon: 15 }, { lat: 38, lon: 25 }, { lat: 31, lon: 31 }, { lat: 13, lon: 46 },
        { lat: 12, lon: 56 }, { lat: 25, lon: 62 }, { lat: 9, lon: 77 }, { lat: 22, lon: 88 },
        { lat: 17, lon: 95 }, { lat: 2, lon: 104 }, { lat: 10, lon: 108 }, { lat: 22, lon: 108 },
        { lat: 20, lon: 115 }, { lat: 35, lon: 120 }, { lat: 40, lon: 125 }, { lat: 54, lon: 140 },
        { lat: 72, lon: 142 }, { lat: 75, lon: 100 }, { lat: 73, lon: 60 }
      ],
      // Africa
      [
        { lat: 36, lon: 10 }, { lat: 32, lon: -8 }, { lat: 21, lon: -17 }, { lat: 14, lon: -15 },
        { lat: 5, lon: 10 }, { lat: -15, lon: 12 }, { lat: -34, lon: 18 }, { lat: -33, lon: 28 },
        { lat: -10, lon: 40 }, { lat: 4, lon: 9 }, { lat: 11, lon: 51 }, { lat: 30, lon: 32 }
      ],
      // Australia
      [
        { lat: -21, lon: 114 }, { lat: -31, lon: 115 }, { lat: -35, lon: 118 }, { lat: -35, lon: 138 },
        { lat: -38, lon: 145 }, { lat: -34, lon: 151 }, { lat: -20, lon: 148 }, { lat: -11, lon: 136 },
        { lat: -12, lon: 130 }, { lat: -21, lon: 114 }
      ],
      // Greenland
      [
        { lat: 78, lon: -70 }, { lat: 82, lon: -60 }, { lat: 81, lon: -20 }, { lat: 70, lon: -25 },
        { lat: 60, lon: -43 }, { lat: 65, lon: -52 }, { lat: 75, lon: -72 }
      ]
    ];

    // Satellites tracking data
    const activeSats = [
      { name: "ISS (ZARYA)", radiusX: 250, radiusY: 90, animSpeed: 0.008, tilt: 0.4, size: 3.5, color: "rgba(34, 211, 238, 0.7)", beamColor: "rgba(34, 211, 238, 0.18)" },
      { name: "GEO-TELEM (T1)", radiusX: 290, radiusY: 130, animSpeed: -0.005, tilt: -0.3, size: 4, color: "rgba(16, 185, 129, 0.7)", beamColor: "rgba(16, 185, 129, 0.18)" },
      { name: "STARLINK-V2", radiusX: 210, radiusY: 70, animSpeed: 0.013, tilt: 0.8, size: 2.5, color: "rgba(245, 158, 11, 0.7)", beamColor: "rgba(245, 158, 11, 0.18)" }
    ];

    // Subtle orbital debris particles tracking system
    const debrisList: { x: number; y: number; z: number; size: number; speed: number; angle: number; type: string }[] = [];
    for (let i = 0; i < 35; i++) {
      debrisList.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        z: Math.random() * 400 - 200,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.0014 + 0.0003,
        angle: Math.random() * Math.PI * 2,
        type: Math.random() > 0.45 ? "pixel" : "cross",
      });
    }

    const R = 135; // Earth radius on interactive terminal
    let angleX = 0.35; // Subtle tilt for isometric view
    let angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse interactive offset attraction with smooth lag
      const targetOffX = (mousePos.x - width / 2) * 0.12;
      const targetOffY = (mousePos.y - height / 2) * 0.12;

      const centerX = width * 0.65 + targetOffX; // Centered to the right space
      const centerY = height * 0.5 + targetOffY;

      // Spin Earth slowly
      angleY += 0.0028;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // 1. Draw 3D twinkling background starfield helper
      stars.forEach((star) => {
        const fov = 500;
        // Project stars with responsive depth shifting
        const scale = fov / (fov + star.z);
        const drawX = centerX + (star.x - targetOffX * 0.4) * scale;
        const drawY = centerY + (star.y - targetOffY * 0.4) * scale;

        const twinkle = Math.sin(Date.now() * 0.0016 + star.z) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
        ctx.fillRect(drawX, drawY, star.size, star.size);
      });

      // 2. Draw atmospheric dense glow overlay surrounding earth
      const atmosphere = ctx.createRadialGradient(centerX, centerY, R * 0.7, centerX, centerY, R * 1.35);
      atmosphere.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      atmosphere.addColorStop(0.5, "rgba(34, 211, 238, 0.18)");
      atmosphere.addColorStop(0.8, "rgba(14, 165, 233, 0.06)");
      atmosphere.addColorStop(1, "rgba(14, 165, 233, 0)");
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(centerX, centerY, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Draw Earth base diagnostic shadow
      ctx.fillStyle = "#060608";
      ctx.beginPath();
      ctx.arc(centerX, centerY, R, 0, Math.PI * 2);
      ctx.fill();

      // Earth outer tracking perimeter ring
      ctx.strokeStyle = "rgba(14, 165, 233, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, R + 10, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Draw latitude coordinate rings programmatically
      const latRings = [-50, -25, 0, 25, 50];
      latRings.forEach((latVal) => {
        ctx.beginPath();
        let first = true;
        const radLat = (latVal * Math.PI) / 180;
        const ringR = R * Math.cos(radLat);
        const ringY = -R * Math.sin(radLat);

        for (let lStep = 0; lStep <= 360; lStep += 8) {
          const radLon = (lStep * Math.PI) / 180;
          let px = ringR * Math.sin(radLon);
          let py = ringY;
          let pz = ringR * Math.cos(radLon);

          // Tilt coordinate space X-axis
          let rotY = py * cosX - pz * sinX;
          let rotZ = pz * cosX + py * sinX;

          // Spin coordinate space Y-axis
          const spinAngle = angleY * 0.45;
          const sCos = Math.cos(spinAngle);
          const sSin = Math.sin(spinAngle);
          let spinX = px * sCos - rotZ * sSin;
          let spinZ = rotZ * sCos + px * sSin;

          // Projection
          const fov = 400;
          const scale = fov / (fov + spinZ);
          const drawX = centerX + spinX * scale;
          const drawY = centerY + rotY * scale;

          if (spinZ < 10) { // Front hemisphere only
            if (first) {
              ctx.moveTo(drawX, drawY);
              first = false;
            } else {
              ctx.lineTo(drawX, drawY);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Draw Rotating Continents on Earth (3D Spherical Meshes)
      continents.forEach((continent) => {
        ctx.beginPath();
        let first = true;

        continent.forEach((coord) => {
          const radLat = (coord.lat * Math.PI) / 180;
          const radLon = (coord.lon * Math.PI) / 180;

          // Parametrize sphere surfaces
          let px = R * Math.cos(radLat) * Math.sin(radLon);
          let py = -R * Math.sin(radLat);
          let pz = R * Math.cos(radLat) * Math.cos(radLon);

          // Apply Earth tilt X
          let rotY = py * cosX - pz * sinX;
          let rotZ = pz * cosX + py * sinX;

          // Apply rotation spin longitude
          const spinAngle = angleY * 0.45;
          const sCos = Math.cos(spinAngle);
          const sSin = Math.sin(spinAngle);
          let spinX = px * sCos - rotZ * sSin;
          let spinZ = rotZ * sCos + px * sSin;

          const fov = 400;
          const scale = fov / (fov + spinZ);
          const drawX = centerX + spinX * scale;
          const drawY = centerY + rotY * scale;

          if (spinZ < 15) { // Render only on frontal hemisphere facing browser camera
            if (first) {
              ctx.moveTo(drawX, drawY);
              first = false;
            } else {
              ctx.lineTo(drawX, drawY);
            }
          } else {
            first = true;
          }
        });

        ctx.strokeStyle = "rgba(20, 184, 166, 0.55)"; // High tech cyan continent lines
        ctx.fillStyle = "rgba(20, 184, 166, 0.04)"; // Dynamic map filling
        ctx.lineWidth = 1.5;
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      });

      // 5. Draw Orbit Trails & High-Gain Active Satellites
      activeSats.forEach((sat, satIdx) => {
        const fovSpace = 400;
        // Orbit speed projection
        const orbitalAngle = angleY * 0.5 * (satIdx + 1) * sat.animSpeed * 12;

        const tCos = Math.cos(sat.tilt);
        const tSin = Math.sin(sat.tilt);

        // Draw general orbital path ellipse
        ctx.beginPath();
        let orbitFirst = true;
        for (let s = 0; s <= 360; s += 5) {
          const stepRad = (s * Math.PI) / 180;
          let ox = sat.radiusX * Math.cos(stepRad);
          let oy = sat.radiusY * Math.sin(stepRad);

          // Apply tilt
          let otx = ox * tCos - oy * tSin;
          let oty = oy * tCos + ox * tSin;
          let otz = 0;

          // Apply X-tilt
          let oRotY = oty * cosX - otz * sinX;
          let oRotZ = otz * cosX + oty * sinX;

          const oScale = fovSpace / (fovSpace + oRotZ);
          const oDrawX = centerX + otx * oScale;
          const oDrawY = centerY + oRotY * oScale;

          if (orbitFirst) {
            ctx.moveTo(oDrawX, oDrawY);
            orbitFirst = false;
          } else {
            ctx.lineTo(oDrawX, oDrawY);
          }
        }
        ctx.strokeStyle = "rgba(34, 211, 238, 0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Calculate satellite current actual 3D coordinates
        let sx = sat.radiusX * Math.cos(orbitalAngle);
        let sy = sat.radiusY * Math.sin(orbitalAngle);
        let sz = 0;

        // Apply orbit plane tilt matrix
        let stx = sx * tCos - sy * tSin;
        let sty = sy * tCos + sx * tSin;
        let stz = sz;

        // Rotate coordinate space X axis
        let rotY = sty * cosX - stz * sinX;
        let rotZ = stz * cosX + sty * sinX;

        // Project
        const scale = fovSpace / (fovSpace + rotZ);
        const drawX = centerX + stx * scale;
        const drawY = centerY + rotY * scale;

        // Render transmission cone towards ground targets (visible if in front)
        if (rotZ < 20) {
          ctx.strokeStyle = sat.beamColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          // Target slightly off center rotating points on Earth surface
          const tarAngle = orbitalAngle + Math.PI * 0.8;
          const targetX = centerX + R * 0.75 * Math.sin(tarAngle) * Math.cos(angleY * 0.1);
          const targetY = centerY + R * 0.45 * Math.cos(tarAngle);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();

          // Target touchdown pulse concentric indicators
          ctx.fillStyle = sat.beamColor;
          ctx.beginPath();
          ctx.arc(targetX, targetY, 4 + Math.sin(Date.now() * 0.012) * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render Satellite body core block
        ctx.fillStyle = sat.color;
        ctx.beginPath();
        ctx.arc(drawX, drawY, sat.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw satellite signal pulses radiating outwards
        const signalPulseRad = (Date.now() * 0.038 + satIdx * 18) % 55;
        ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0, 1 - signalPulseRad / 55) * 0.28})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(drawX, drawY, signalPulseRad * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Draw lateral solar panel grid frames
        ctx.fillStyle = "rgba(16, 185, 129, 0.6)"; // Emerald green panels
        ctx.fillRect(drawX - 8 * scale, drawY - 1.5 * scale, 5 * scale, 3 * scale);
        ctx.fillRect(drawX + 3 * scale, drawY - 1.5 * scale, 5 * scale, 3 * scale);

        // Render high-gain antenna node
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(drawX, drawY + 4 * scale);
        ctx.stroke();

        // Overlay text labels
        ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
        ctx.font = "8px monospace";
        ctx.fillText(sat.name, drawX + 10, drawY + 3);
      });

      // 5b. Render and update subtle orbital debris particles
      debrisList.forEach((deb) => {
        deb.angle += deb.speed;
        
        // Circular orbit projection space coords relative to system center
        const distanceX = 240 + deb.z * 0.25;
        const distanceY = 90 + deb.z * 0.12;
        
        let dx = Math.cos(deb.angle) * distanceX;
        let dy = Math.sin(deb.angle) * distanceY;
        let dz = deb.z;

        // Apply Earth tilt alignment
        let rotY = dy * cosX - dz * sinX;
        let rotZ = dz * cosX + dy * sinX;

        const fovSpace = 400;
        const scale = fovSpace / (fovSpace + rotZ);
        const drawX = centerX + dx * scale;
        const drawY = centerY + rotY * scale;

        // Depth alpha calculations
        const alpha = Math.max(0.08, Math.min(0.4, (fovSpace - rotZ) / (fovSpace * 2))) * 0.45;
        
        ctx.strokeStyle = `rgba(161, 161, 170, ${alpha})`;
        ctx.fillStyle = `rgba(161, 161, 170, ${alpha})`;
        ctx.lineWidth = 0.5;

        if (deb.type === "cross") {
          ctx.beginPath();
          ctx.moveTo(drawX - 2 * scale, drawY);
          ctx.lineTo(drawX + 2 * scale, drawY);
          ctx.moveTo(drawX, drawY - 2 * scale);
          ctx.lineTo(drawX, drawY + 2 * scale);
          ctx.stroke();
        } else {
          ctx.fillRect(drawX - 0.5, drawY - 0.5, deb.size, deb.size);
        }
      });

      // 6. Draw floating customized Astronaut (EVA Unit JP)
      const driftX = Math.sin(Date.now() * 0.0007) * 20;
      const driftY = Math.cos(Date.now() * 0.00085) * 14;

      // Position astronaut drifting at the upper-right region
      const aCenterX = centerX + 260 + driftX;
      const aCenterY = centerY - 140 + driftY;

      // Draw secure metallic oxygen life support tether cable connected back to systems
      ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Wave the cable dynamically mimicking zero gravity
      ctx.moveTo(centerX, centerY);
      for (let t = 0; t <= 1; t += 0.05) {
        const wave = Math.sin(t * Math.PI * 2.5 + Date.now() * 0.0022) * 15;
        const tx = centerX * (1 - t) + aCenterX * t + wave * (1 - t);
        const ty = centerY * (1 - t) + aCenterY * t + wave * (1 - t);
        ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      // Render Astronaut backpack life-support compartment
      ctx.fillStyle = "rgba(10, 10, 15, 0.82)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.fillRect(aCenterX - 16, aCenterY - 10, 10, 22);
      ctx.strokeRect(aCenterX - 16, aCenterY - 10, 10, 22);

      // Render suit limbs & body chassis
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 1.5;

      // Oxygen chests visual unit
      ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
      ctx.beginPath();
      ctx.arc(aCenterX, aCenterY + 11, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Breathing flashing indicators (green / red active LED blink sequence)
      ctx.fillStyle = Math.sin(Date.now() * 0.006) > 0 ? "rgba(52, 211, 153, 0.95)" : "rgba(239, 68, 68, 0.95)";
      ctx.fillRect(aCenterX - 2.5, aCenterY + 10, 2, 2);
      ctx.fillStyle = Math.sin(Date.now() * 0.006) <= 0 ? "rgba(52, 211, 153, 0.95)" : "rgba(14, 165, 233, 0.95)";
      ctx.fillRect(aCenterX + 0.5, aCenterY + 10, 2, 2);

      // Main spacesuit helmet
      ctx.fillStyle = "rgba(15, 23, 42, 0.96)";
      ctx.beginPath();
      ctx.arc(aCenterX, aCenterY, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Reflective glowing gold/amber cyber visor
      const goldGrad = ctx.createLinearGradient(aCenterX - 5, aCenterY - 3, aCenterX + 5, aCenterY + 3);
      goldGrad.addColorStop(0, "rgba(245, 158, 11, 0.95)");
      goldGrad.addColorStop(1, "rgba(251, 191, 36, 0.65)");
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.ellipse(aCenterX + 1.5, aCenterY - 0.5, 5.5, 3.8, 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Left floating arm
      ctx.beginPath();
      ctx.moveTo(aCenterX - 6.5, aCenterY + 7);
      ctx.bezierCurveTo(aCenterX - 11, aCenterY + 5, aCenterX - 13, aCenterY, aCenterX - 10, aCenterY - 4);
      ctx.stroke();

      // Right hand waving programmatically!
      const handWaveOffset = Math.sin(Date.now() * 0.0035) * 4;
      ctx.beginPath();
      ctx.moveTo(aCenterX + 6.5, aCenterY + 7);
      ctx.bezierCurveTo(aCenterX + 13, aCenterY + 8, aCenterX + 15, aCenterY + 1.5 + handWaveOffset, aCenterX + 11, aCenterY - 4 + handWaveOffset);
      ctx.stroke();

      // Zero-gravity floating legs
      ctx.beginPath();
      ctx.moveTo(aCenterX - 4, aCenterY + 16);
      ctx.bezierCurveTo(aCenterX - 5.5, aCenterY + 23, aCenterX - 9, aCenterY + 27, aCenterX - 7, aCenterY + 32);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(aCenterX + 4, aCenterY + 16);
      ctx.bezierCurveTo(aCenterX + 5.5, aCenterY + 25, aCenterX + 3, aCenterY + 28, aCenterX + 4.5, aCenterY + 33);
      ctx.stroke();

      // EVA technical indicator label
      ctx.fillStyle = "rgba(45, 212, 191, 0.8)";
      ctx.font = "8px monospace";
      ctx.fillText("EVA_SUIT: ONLINE", aCenterX - 34, aCenterY - 14);


      // Scanline simulation
      ctx.fillStyle = "rgba(5, 5, 5, 0.04)";
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);
  */

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-24 bg-transparent overflow-hidden border-b border-zinc-800/60 select-none flex flex-col justify-between"
    >
      {/* Absolute Backdrop Grid */}
      <motion.div 
        className="absolute inset-0 grid-bg pointer-events-none" 
        style={{
          y: springGridY,
          opacity: springGridOpacity,
        }}
      />

      {/* Cyber Compass / Dial Decorative Target Layer */}
      <motion.div
        className="absolute right-[8%] top-[18%] w-[500px] h-[500px] border border-cyan-500/10 rounded-full flex items-center justify-center pointer-events-none hidden lg:flex"
        style={{
          y: springDialY,
          rotate: springDialRotate,
          opacity: springDialOpacity,
        }}
      >
        <div className="w-[400px] h-[400px] border border-dashed border-cyan-500/5 rounded-full flex items-center justify-center">
          <div className="w-[260px] h-[260px] border border-cyan-500/5 rounded-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-cyan-400/20 stroke-[1]">
              <line x1="24" y1="0" x2="24" y2="48" />
              <line x1="0" y1="24" x2="48" y2="24" />
              <circle cx="24" cy="24" r="14" className="stroke-cyan-500/15" />
            </svg>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {booting ? (
          <motion.div
            key="boot-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center items-center px-6 z-10 font-mono text-zinc-500 text-xs text-left max-w-xl mx-auto w-full my-auto"
          >
            <div className="w-full bg-[#0a0a0c] border border-zinc-800 p-6 rounded-sm shadow-2xl relative">
              <div className="absolute top-0 right-0 m-3 px-1.5 py-0.5 border border-amber-500/30 text-[10px] text-amber-500 font-bold tracking-wider rounded-sm animate-pulse">
                [ DIAGNOSTIC RUNNING ]
              </div>
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3 text-zinc-400 font-medium">
                <Cpu size={14} className="text-cyan-400 animate-spin" />
                <span>BOOT_SEQUENCE_INITIALIZER // v2.5</span>
              </div>
              <div className="space-y-1.5 min-h-[180px] overflow-hidden font-mono leading-relaxed text-zinc-400">
                {bootLog.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-zinc-600">[{index.toString().padStart(2, "0")}]</span>
                    <span className={log?.includes("IGNITION") ? "text-cyan-400 font-semibold" : ""}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-600 text-[10px]">
                <span>IP: 192.168.100.42</span>
                <span className="terminal-cursor">_</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-hero"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row items-center justify-between z-10 pt-8"
          >
            {/* Left Column Content */}
            <motion.div 
              className="flex-1 max-w-2xl text-left md:pr-8 py-8"
              style={{ y: springContentY }}
            >
              {/* Upper System Status Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-2 py-0.5 border border-zinc-800 bg-[#0c0c0e] text-[10px] text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  SYS_ACTIVE
                </span>
                <span className="px-2 py-0.5 border border-zinc-800 bg-[#0c0c0e] text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                  CLASSIFICATION: UNRESTRICTED
                </span>
                <span className="px-2 py-0.5 border border-zinc-800 bg-[#0c0c0e] text-[10px] text-cyan-400 uppercase tracking-widest font-mono tracking-tighter">
                  B.TECH CSE (IoT) @ SNU
                </span>
              </div>

              {/* Stark brutalist headers with Fuzzy Glitch effects */}
              <div className="select-text mb-4">
                <FuzzyText
                  fontSize="clamp(2.2rem, 6.2vw, 4.4rem)"
                  fontWeight={800}
                  color="#ffffff"
                  enableHover={true}
                  baseIntensity={0.06}
                  hoverIntensity={0.4}
                  fuzzRange={15}
                  glitchMode={true}
                  glitchInterval={6000}
                  glitchDuration={200}
                  className="font-bold font-sans uppercase -mb-1 block"
                  style={{
                    marginLeft: "-41px",
                    marginTop: "-6px",
                  }}
                >
                  JEEVA PRAVIN P K
                </FuzzyText>
              </div>

              <div className="select-text mb-8">
                <FuzzyText
                  fontSize="clamp(0.85rem, 1.6vw, 1.1rem)"
                  fontWeight={600}
                  color="#22d3ee"
                  fontFamily="'JetBrains Mono', monospace"
                  enableHover={true}
                  baseIntensity={0.05}
                  hoverIntensity={0.3}
                  fuzzRange={10}
                  glitchMode={true}
                  glitchInterval={6000}
                  glitchDuration={200}
                  letterSpacing={4}
                  className="font-semibold uppercase block"
                  style={{
                    marginLeft: "-35px",
                    marginTop: "0px",
                  }}
                >
                  EDGE AI & SYSTEMS ENGINEER
                </FuzzyText>
              </div>

              <p className="text-zinc-400 font-sans tracking-wide leading-relaxed text-sm md:text-base max-w-xl mb-8 select-text">
                Architecting autonomous multi-agent pipelines, local knowledge graphs, and real-time spatial telemetry. Fusing deep-learning pipelines, decentralized networks, and rugged systems integration. Currently achieving a <span className="text-white font-medium font-mono">9.0 CGPA</span> at Shiv Nadar University.
              </p>

              {/* Hardware Diagnostics Metrics Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg font-mono">
                <div className="border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-3 rounded-sm">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Cpu size={12} className="text-cyan-400" /> COMPUTE ACCEL
                  </div>
                  <div className="text-xs text-white uppercase mt-1">RTX 3050 Node</div>
                </div>
                <div className="border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-3 rounded-sm">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Activity size={12} className="text-amber-500" /> TEMP DIAG
                  </div>
                  <div className="text-xs text-white uppercase mt-1">{systemMetrics.temp}</div>
                </div>
                <div className="border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-3 rounded-sm col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Server size={12} className="text-lime-500" /> SYSTEM RAM
                  </div>
                  <div className="text-xs text-white uppercase mt-1">{systemMetrics.mem}</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Mini Vector Coordinate Overlay Grid - Only on desktop */}
            <motion.div 
              className="hidden lg:flex flex-col justify-end items-end h-full font-mono text-[10px] text-zinc-500 space-y-4 pr-4"
              style={{
                y: springRightColY,
                opacity: springRightColOpacity,
              }}
            >
              <div className="border border-zinc-800/80 bg-zinc-950/80 p-4 rounded-sm space-y-2 text-right">
                <div>[ AZIMUTH RANGE LAYOUT ]</div>
                <div className="text-xs text-cyan-400">{(Math.sin(Date.now() / 2000) * 0.5).toFixed(5)} RAD / SEC</div>
                <div className="text-white">RADIUS INDEX: 240m</div>
                <div className="text-zinc-600">SVD APERTURE DECONV: OK</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Continuous Telemetry Ticker (Monospace) */}
      <div className="w-full h-8 border-t border-zinc-800 bg-zinc-950/90 flex items-center overflow-hidden z-20">
        <div className="flex animate-[infinite-scroll_25s_linear_infinite] whitespace-nowrap text-zinc-500 font-mono text-[11px] gap-8 py-1">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="flex gap-8">
                <span>GEMINI 2.5 FLASH: <strong className="text-cyan-400">STANDBY</strong></span>
                <span className="text-zinc-700">//</span>
                <span>TAILSCALE MESH NETWORK: <strong className="text-emerald-400">ONLINE (18.2ms)</strong></span>
                <span className="text-zinc-700">//</span>
                <span>QDRANT VECTOR DB: <strong className="text-yellow-400">ACTIVE [LOCAL_CONTAINER]</strong></span>
                <span className="text-zinc-700">//</span>
                <span>H3 SPATIAL INDEXING: <strong className="text-cyan-400">NOMINAL (RES_8_HEX)</strong></span>
                <span className="text-zinc-700">//</span>
                <span>OLLAMA RUNTIME COMPUTE: <strong className="text-zinc-300">GPU ACTIVE</strong></span>
                <span className="text-zinc-700">//</span>
              </span>
            ))}
        </div>
      </div>

      {/* CSS Animation Keyframes for continuous horizontal scroll */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
