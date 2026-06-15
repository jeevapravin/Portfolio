import React, { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, ShieldAlert, Cpu, Check, AlertCircle } from "lucide-react";
import { TerminalLine, ChatMessage } from "../types";
import { playKeyClick, playTelemetryCheck, playTelemetryWarning } from "../utils/audio";
import FuzzyText from "./FuzzyText";

export default function LiveTelemetryTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "sh-1",
      type: "system",
      text: "[SYS_ADMIN] Jeeva Pravin P K v2.5.0 securely linked in secure sandbox.",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "sh-2",
      type: "system",
      text: "Initializing RAG agent... Context loaded. System ready.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inpValue, setInpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Suggested quick prompts for recruiters
  const suggestedCommands = [
    "Tell me about Jeeva's spatial indexing",
    "Describe Neevcode AI integration",
    "How does GoalMind's multi-agent system work?",
    "Explain CLIP deconvolution via SVD"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, loading]);

  const handleQuerySubmit = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    playTelemetryCheck();

    const userMessage: TerminalLine = {
      id: `usr-${Date.now()}`,
      type: "user",
      text: `> ${textToSend}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLines((prev) => [...prev, userMessage]);
    setInpValue("");
    setLoading(true);

    try {
      // Build previous messages for context
      // Limit to last 6 chat points to optimize token payload
      const chatContext: ChatMessage[] = lines
          .filter((l) => l.type === "user" || l.type === "response")
          .slice(-6)
          .map((l) => ({
            role: l.type === "user" ? "user" : "model",
            text: l.text.startsWith("> ") ? l.text.substring(2) : l.text,
          }));

      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatContext,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        playTelemetryCheck();
        setLines((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            type: "response",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else if (data.error) {
        playTelemetryWarning();
        setLines((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: "error",
            text: `[TELEMETER LINK ERROR]: ${data.error}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

    } catch (e: any) {
      playTelemetryWarning();
      setLines((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: "error",
          text: `[CORE BUS ERROR]: Failed to establish handshake with cloud processor. Defaulting to local offline matrix.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuerySubmit(inpValue);
  };

  const handleClear = () => {
    playTelemetryCheck();
    setLines([
      {
        id: `sys-${Date.now()}`,
        type: "system",
        text: "Interactive Node memory cleared. Terminals updated correctly.",
        timestamp: new Date().toLocaleTimeString(),
      }
    ]);
  };

  return (
    <section id="terminal" className="relative py-24 bg-transparent border-b border-zinc-800/60 font-mono">
      {/* Absolute Backdrop Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        
        {/* Header Decors */}
        <div className="mb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>INTERACTIVE_PORTAL // HR_ENG_LIAISON</span>
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
              LIVE TELEMETRY TERMINAL
            </FuzzyText>
          </div>
          <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wide font-sans">
            Leverage Google Gemini 3.5-Flash to query Jeeva's spatial parameters, multi-agent frameworks, and technical benchmarks.
          </p>
        </div>

        {/* Console Box Outer Shell */}
        <div className="border border-zinc-700 bg-black rounded-md overflow-hidden shadow-2xl relative">
          
          {/* Header Bar */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-zinc-400 font-mono text-[11px] font-semibold tracking-wider ml-2">
                Terminal // Gemini 2.5 Flash Link // Active
              </span>
            </div>
            
            {/* Minimal Indicators */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] p-1 border border-zinc-800 text-zinc-500 leading-none">
                ENCRYPT_ON
              </span>
              <button
                onClick={handleClear}
                className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800 px-1.5 py-0.5 uppercase bg-black"
                title="Clear console lines"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Console Log Output Body */}
          <div
            ref={scrollRef}
            className="p-5 h-96 overflow-y-auto text-[13px] leading-relaxed select-text space-y-4"
            style={{ backgroundColor: "#020202" }}
          >
            {lines.map((line) => {
              let textClass = "text-zinc-300";
              if (line.type === "system") textClass = "text-zinc-500 font-medium";
              if (line.type === "user") textClass = "text-cyan-400 font-semibold";
              if (line.type === "error") textClass = "text-rose-400 font-mono";

              return (
                <div key={line.id} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-700 select-none font-mono">
                    <span>STATUS: RECVD</span>
                    <span>{line.timestamp}</span>
                  </div>
                  <div className={`${textClass} whitespace-pre-wrap break-words font-mono`}>
                    {line.text}
                  </div>
                </div>
              );
            })}

            {/* Simulated Live Generation Loader */}
            {loading && (
              <div className="flex items-center gap-2 text-amber-500 animate-pulse font-mono py-2">
                <Cpu size={14} className="animate-spin" />
                <span>JPCORE Systems Liaison deciphering stream...</span>
              </div>
            )}
          </div>

          {/* Command execution console bar */}
          <form
            onSubmit={onFormSubmit}
            className="border-t border-zinc-800 bg-black py-3 px-4 flex items-center gap-2 font-mono"
          >
            <span className="text-cyan-400 font-bold select-none">&gt;</span>
            <input
              type="text"
              value={inpValue}
              onChange={(e) => setInpValue(e.target.value)}
              onKeyDown={() => playKeyClick()}
              placeholder="Query routing, agentic models or experience timelines..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-600 text-sm focus:ring-0 select-text"
              disabled={loading}
              id="terminal-query-input"
            />
            <button
              type="submit"
              disabled={loading || !inpValue.trim()}
              className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 uppercase text-xs hover:text-white hover:bg-zinc-800 transition-all rounded-sm disabled:opacity-30 disabled:hover:bg-zinc-900 cursor-pointer"
            >
              Ex_
            </button>
          </form>
        </div>

        {/* Preset Command Shortcuts */}
        <div className="mt-5 space-y-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
            [ SECURE TELEMETRY CHANNELS ] Quick queries:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedCommands.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuerySubmit(prompt)}
                disabled={loading}
                className="text-[11px] border border-zinc-800/80 hover:border-zinc-700 hover:text-cyan-400 bg-[#09090b]/80 px-3 py-1.5 text-zinc-400 cursor-pointer rounded-sm hover:shadow-[0_0_10px_-3px_rgba(34,211,238,0.15)] transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
