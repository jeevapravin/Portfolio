import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg, rgba(8, 12, 18, 0.9) 0%, rgba(15, 23, 42, 0.75) 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "",
  iconUrl = "",
  grainUrl = "",
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor = "rgba(34, 211, 238, 0.45)",
  behindGlowSize = "45%",
  className = "",
  enableTilt = true,
  enableMobileTilt = true,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Jeeva Pravin P K",
  title = "Edge AI & Systems Engineer",
  handle = "jp_edge_01",
  status = "Online",
  contactText = "Contact Me",
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(!avatarUrl);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(!avatarUrl);
  }, [avatarUrl]);

  // Unified interactive 3D physics tilt engine
  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      for (const [k, v] of Object.entries(properties)) {
        wrap.style.setProperty(k, v);
      }
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (evt: PointerEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add("active");
      shell.classList.add("entering");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove("active");
        if (leaveRafRef.current) {
          cancelAnimationFrame(leaveRafRef.current);
          leaveRafRef.current = null;
        }
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener("pointerenter", pointerEnterHandler);
    shell.addEventListener("pointermove", pointerMoveHandler);
    shell.addEventListener("pointerleave", pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || window.location.protocol !== "https:") return;
      const anyMotion = (window as any).DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === "function") {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", deviceOrientationHandler);
      }
    };
    shell.addEventListener("click", handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", pointerEnterHandler);
      shell.removeEventListener("pointermove", pointerMoveHandler);
      shell.removeEventListener("pointerleave", pointerLeaveHandler);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove("entering");
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo<React.CSSProperties>(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color": behindGlowColor ?? "rgba(125, 190, 255, 0.67)",
        "--behind-glow-size": behindGlowSize ?? "50%",
      } as React.CSSProperties),
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  // Handcrafted vector representation matching Jeeva's photo
  // South Asian face, wavy medium black hair, black polo, scenic terraced park, peace sign gesture!
  const renderSelfieSVG = () => {
    return (
      <svg
        viewBox="0 0 400 500"
        className="avatar select-none"
        style={{
          width: "100%",
          position: "absolute",
          left: "50%",
          transformOrigin: "50% 100%",
          transform: "translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01))",
          bottom: "-1px",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform",
          transition: "transform 120ms ease-out",
        }}
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43505c" />
            <stop offset="60%" stopColor="#879aa9" />
            <stop offset="100%" stopColor="#a7b8c7" />
          </linearGradient>

          {/* Gradients for terraced green hills */}
          <linearGradient id="hill1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a3a2a" />
            <stop offset="100%" stopColor="#2c5c43" />
          </linearGradient>
          <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#224d36" />
            <stop offset="100%" stopColor="#377255" />
          </linearGradient>
          <linearGradient id="hillhighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#52b788" />
            <stop offset="100%" stopColor="#74c69d" />
          </linearGradient>

          {/* Facial Skin Tone Gradient (Warm South Asian tone) */}
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#df9c74" />
            <stop offset="60%" stopColor="#ca855c" />
            <stop offset="100%" stopColor="#b17048" />
          </linearGradient>
          <linearGradient id="skinShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#be7e57" />
            <stop offset="100%" stopColor="#9a5e38" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#202025" />
            <stop offset="50%" stopColor="#0b0b0d" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          {/* Card rounded mask */}
          <clipPath id="avatarClip">
            <rect x="0" y="0" width="400" height="500" rx="30" />
          </clipPath>
        </defs>

        <g clipPath="url(#avatarClip)">
          {/* 1. SCENIC BACKGROUND (Terraced Garden under Cloudy Sky) */}
          {/* Cloud Cover Sky */}
          <rect width="400" height="500" fill="url(#sky)" />

          {/* Cloudy elements */}
          <path d="M-10 120 C 60 70, 150 90, 220 120 C 290 150, 360 110, 420 120 L 420 280 L -10 280 Z" fill="#ccd7e0" opacity="0.4" />
          <path d="M-20 80 C 80 50, 200 40, 260 80 C 320 120, 380 70, 430 90 L 430 200 L -20 200 Z" fill="#9db0bf" opacity="0.3" />

          {/* Terraced Hillside Layers */}
          {/* Far ridge */}
          <path d="M-10 240 C 90 200, 220 250, 410 210 L 410 400 L -10 400 Z" fill="url(#hill1)" />
          {/* Middle terraced layer */}
          <path d="M-10 290 C 110 250, 180 290, 310 250 C 370 230, 390 240, 410 230 L 410 450 L -10 450 Z" fill="url(#hill2)" />
          
          {/* Golden flower accents / terrace fences on hill */}
          <path d="M40 285 C 80 270, 120 280, 160 282" fill="none" stroke="url(#hillhighlight)" strokeWidth="3" opacity="0.6" />
          <path d="M180 278 C 220 262, 270 268, 320 260" fill="none" stroke="url(#hillhighlight)" strokeWidth="3" opacity="0.6" />
          <path d="M30 330 C 130 290, 220 330, 340 298" fill="none" stroke="#2d6a4f" strokeWidth="2.5" opacity="0.8" />

          {/* 2. CHARACTER MODEL (Jeeva Pravin P K) */}
          {/* Shoulders & Sleek Black Polo */}
          <path d="M60 410 C100 360, 140 330, 200 330 C260 330, 330 360, 370 410 C390 435, 400 480, 400 500 L0 500 L0 440 Z" fill="#0d0e12" />
          
          {/* Polo Placket / Collar Base */}
          <path d="M165 330 L200 375 L235 330 Z" fill="#1b1c21" />
          <path d="M200 332 L200 373" stroke="#25272f" strokeWidth="2" />
          <circle cx="200" cy="348" r="3" fill="#0d0e12" />
          <circle cx="200" cy="362" r="3" fill="#0d0e12" />

          {/* Open Collar Flaps */}
          <path d="M162 330 L195 365 L170 338 Z" fill="#14151a" />
          <path d="M238 330 L205 365 L230 338 Z" fill="#14151a" stroke="#25272a" strokeWidth="0.5" />

          {/* Neck */}
          <path d="M172 280 C172 315, 175 340, 200 340 C225 340, 228 315, 228 280 Z" fill="url(#skinShadow)" />
          {/* Adam's apple throat line */}
          <path d="M200 295 L200 318" stroke="#874e2d" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Ears */}
          <path d="M136 215 C132 210, 132 230, 137 235 Z" fill="#ca855c" />
          <path d="M264 215 C268 210, 268 230, 263 235 Z" fill="#ca855c" />

          {/* Face */}
          <path d="M140 180 C140 120, 260 120, 260 180 C260 252, 245 272, 200 272 C155 272, 140 252, 140 180 Z" fill="url(#skin)" />
          {/* Forehead Shadow */}
          <path d="M140 170 C140 150, 260 150, 260 170 C240 162, 160 162, 140 170 Z" fill="#b17048" opacity="0.25" />

          {/* Nose */}
          <path d="M195 198 L200 220 L207 220" stroke="#a05d39" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Mouth (Friendly neutral, slight closed lip smile) */}
          <path d="M178 241 C185 247, 215 247, 222 241" fill="none" stroke="#713516" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M185 240 C192 243, 208 243, 215 240" fill="none" stroke="#904724" strokeWidth="1.2" />

          {/* Eyes & Eyebrows */}
          {/* Left Eyebrow */}
          <path d="M156 178 C163 172, 177 172, 184 177" stroke="#101015" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Right Eyebrow */}
          <path d="M216 178 C223 172, 237 172, 244 177" stroke="#101015" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Left Eye */}
          <path d="M162 188 C166 182, 178 182, 182 188" stroke="#101015" strokeWidth="1.8" fill="none" />
          <ellipse cx="172" cy="188.5" rx="3.5" ry="2.5" fill="#1a1a20" />
          <circle cx="173.5" cy="187.5" r="1" fill="#ffffff" />
          
          {/* Right Eye */}
          <path d="M218 188 C222 182, 234 182, 238 188" stroke="#101015" strokeWidth="1.8" fill="none" />
          <ellipse cx="228" cy="188.5" rx="3.5" ry="2.5" fill="#1a1a20" />
          <circle cx="229.5" cy="187.5" r="1" fill="#ffffff" />

          {/* Flattering cheek contour details */}
          <path d="M150 215 C155 225, 165 235, 174 238" stroke="#be7a55" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M250 215 C245 225, 235 235, 226 238" stroke="#be7a55" strokeWidth="1" fill="none" opacity="0.3" />

          {/* Wavy, Stylish parted medium Black Hair (Precisely styled) */}
          <path d="M136 180 C130 190, 132 215, 138 225 C141 210, 138 185, 142 180 Z" fill="#08080a" />
          <path d="M264 180 C270 190, 268 215, 262 225 C259 210, 262 185, 258 180 Z" fill="#08080a" />
          
          {/* Main majestic hair volume with gorgeous sweeps */}
          <path d="M142 176 C130 145, 150 115, 176 110 C200 105, 220 110, 232 114 C255 119, 270 145, 258 176 C250 160, 230 146, 208 148 C188 150, 172 153, 158 165 C150 171, 145 174, 142 176 Z" fill="url(#hair)" />
          {/* Fringe/Sweeps parting over forehead right and left */}
          <path d="M138 178 C144 165, 162 158, 174 166 C162 168, 150 175, 144 184 Z" fill="#121216" />
          <path d="M262 178 C256 165, 238 158, 226 166 C238 168, 250 175, 256 184 Z" fill="#121216" />
          <path d="M190 152 C196 148, 206 148, 212 152 C204 154, 196 157, 192 162 Z" fill="#08080a" />

          {/* 3. DYNAMIC HAND GESTURE (Raising Peace Sign) */}
          {/* Arm leading to hand */}
          <path d="M260 410 L285 320 C290 300, 310 290, 320 310 L310 390 Z" fill="#0d0e12" />
          
          {/* Hand/Palm Area positioned at right side */}
          {/* Hand Wrist/Base sleeve cuff outline */}
          <path d="M284 316 C282 308, 290 303, 296 302 L312 320 C306 325, 295 326, 284 316 Z" fill="#ca855c" />
          
          {/* The hand palm */}
          <path d="M292 284 C292 274, 305 264, 318 266 C326 268, 332 278, 328 290 C322 305, 305 316, 295 306 Z" fill="#df9c74" />

          {/* Index and Middle Extended Fingers (The Peace sign!) */}
          {/* Index finger */}
          <path d="M298 268 L284 216 C282 210, 290 206, 294 212 L306 262 Z" fill="#eaad89" stroke="#b17048" strokeWidth="1" />
          {/* Middle finger */}
          <path d="M308 264 L304 204 C304 198, 313 198, 314 204 L316 258 Z" fill="#eaad89" stroke="#b17048" strokeWidth="1" />
          
          {/* Folded Ring and Pinky Fingers */}
          <path d="M322 272 C320 278, 315 284, 312 284 C309 284, 308 276, 313 272 Z" fill="#ca855c" stroke="#9a5e38" strokeWidth="1" />
          <path d="M325 282 C323 287, 319 292, 316 292 C313 292, 313 286, 318 282 Z" fill="#ca855c" stroke="#9a5e38" strokeWidth="1" />

          {/* Folded Thumb over ring finger */}
          <path d="M295 290 C290 286, 304 278, 312 280 C316 281, 312 290, 306 292 Z" fill="#df9c74" stroke="#b17048" strokeWidth="1" />

        </g>
      </svg>
    );
  };

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className={`pc-content pc-avatar-content ${(avatarUrl && !imageError) ? "has-real-image" : ""}`}>
              {avatarUrl && !imageError && (
                <img
                  className="avatar"
                  src={avatarUrl}
                  alt={`${name || "User"} avatar`}
                  loading="eager"
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                  onError={() => {
                     setImageError(true);
                  }}
                  referrerPolicy="no-referrer"
                  style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.25s ease-out"
                  }}
                />
              )}
              {(!imageLoaded || imageError) && renderSelfieSVG()}

              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      {(imageLoaded && !imageError && avatarUrl) || miniAvatarUrl ? (
                        <img
                          src={miniAvatarUrl || avatarUrl}
                          alt={`${name || "User"} mini avatar`}
                          loading="lazy"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.style.opacity = "0.5";
                          }}
                        />
                      ) : (
                        // Render miniature stylized avatar icon matching color palette
                        <div className="w-full h-full bg-gradient-to-tr from-cyan-900 to-slate-950 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">
                          JP
                        </div>
                      )}
                    </div>
                    <div className="pc-user-text font-mono">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        <span>{status}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn font-mono"
                    onClick={handleContactClick}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name || "user"}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details font-sans">
                <h3>{name}</h3>
                <p className="font-mono text-cyan-400 uppercase tracking-[0.22em] text-[10px] sm:text-[11px] font-semibold mt-1">
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
