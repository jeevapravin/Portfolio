import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Terminal, Key, Shield, HelpCircle, Check, Loader2 } from "lucide-react";
import FuzzyText from "./FuzzyText";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "SECURE INTEL // PROJECT ENGAGEMENT",
    message: "",
  });

  const [state, setState] = useState<"idle" | "transmitting" | "success">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [useMailtoFallback, setUseMailtoFallback] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("WARNING: Mandatory payload registers are empty. Please fill out details.");
      return;
    }

    setState("transmitting");
    setUseMailtoFallback(false);
    setLogs([
      "INITIALIZING DIRECT TUNNEL LINK...",
      "STABILIZING HYBRID COMMS EDGE CONTEXT...",
      "VERIFYING ROUTING HANDSHAKE PATH...",
    ]);

    try {
      // Simulate premium secure protocol packaging lag
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLogs((prev) => [...prev, "PACKAGING COMMS HEADER BLOCK...", "CONTACTING JP CENTRAL COMMS API ROUTE..."]);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLogs((prev) => [...prev, "SECURE SERVER ROUTE HANDSHAKE SUCCESSFUL.", "PAYLOAD DISPATCHED SUCCESSFULLY VIA CLOUD GATEWAY."]);
          setState("success");
        } else if (result.fallback) {
          // No API key configured on server: instruct client to fall back to native mailto client
          setLogs((prev) => [
            ...prev,
            "COMMS API ALERT: SERVER-SIDE API KEY [RESEND_API_KEY] IS OFFLINE.",
            "ACTIVATING SECURE CLIENT-SIDE [MAILTO] FALLBACK PROTOCOL..."
          ]);
          setUseMailtoFallback(true);

          // Dispatched via local app
          setTimeout(() => {
            const mailtoSubject = encodeURIComponent(`[JP_PORTAL] ${formData.subject}`);
            const mailtoBody = encodeURIComponent(
              `--- JP SECURE PORTAL DECRYPTED TRANSMISSION ---\n\n` +
              `SENDER_NAME: ${formData.name}\n` +
              `SENDER_EMAIL: ${formData.email}\n` +
              `SUBJECT: ${formData.subject}\n\n` +
              `--- MESSAGE DESCRIPTION ---\n` +
              `${formData.message}\n\n` +
              `--- END OF TELEMETRY UPLINK ---`
            );
            window.location.href = `mailto:jeevapravinhere@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            setState("success");
          }, 1200);
        } else {
          throw new Error(result.error || "Internal delivery protocol error.");
        }
      } else {
        throw new Error(`HTTP network failure code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Encryption bypass error, falling back:", error);
      setLogs((prev) => [
        ...prev,
        "GATEWAY EXCEPTION: CONTACT PATHWAY TIMEOUT.",
        "ENFORCING INSTANT EMERGENCY LOCAL MAILTO ACTION..."
      ]);
      setUseMailtoFallback(true);

      setTimeout(() => {
        const mailtoSubject = encodeURIComponent(`[JP_PORTAL] ${formData.subject}`);
        const mailtoBody = encodeURIComponent(
          `--- JP SECURE PORTAL DECRYPTED TRANSMISSION ---\n\n` +
          `SENDER_NAME: ${formData.name}\n` +
          `SENDER_EMAIL: ${formData.email}\n` +
          `SUBJECT: ${formData.subject}\n\n` +
          `--- MESSAGE DESCRIPTION ---\n` +
          `${formData.message}\n\n` +
          `--- END OF TELEMETRY UPLINK ---`
        );
        window.location.href = `mailto:jeevapravinhere@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        setState("success");
      }, 1000);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "SECURE INTEL // PROJECT ENGAGEMENT",
      message: "",
    });
    setState("idle");
    setUseMailtoFallback(false);
    setLogs([]);
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent border-t border-zinc-900/60 font-sans">
      {/* Absolute Backdrop Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Module Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500 mb-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            <span>COMM_GATEWAY_NODE // ADDR: jeevapravinhere@gmail.com</span>
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
              INITIATE CONTACT
            </FuzzyText>
          </div>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-wide">
            ESTABLISH DIRECT SECURE FREQUENCY UPLINK WITH JEEVA PRAVIN
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* UPLINK INPUT FIELDS */}
          <div className="md:col-span-7 border border-zinc-800 bg-[#0c0c0e]/95 backdrop-blur-md p-6 rounded-sm relative flex flex-col justify-between">
            {/* High-Contrast Design corner markers */}
            <div className="absolute top-0 left-0 w-3 h-[1px] bg-cyan-400/80" />
            <div className="absolute top-0 left-0 w-[1px] h-3 bg-cyan-400/80" />
            <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-cyan-400/80" />
            <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-cyan-400/80" />

            <AnimatePresence mode="wait">
              {state !== "success" ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleTransmit} 
                  className="space-y-4"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold">&#187;</span> SENDER IDENTITY
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={state === "transmitting"}
                        placeholder="e.g. AGENT COOPER"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#050507] border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 py-2 px-3 text-white rounded-none outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold">&#187;</span> CALLBACK VECTOR
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={state === "transmitting"}
                        placeholder="e.g. cooper@fbi.gov"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#050507] border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 py-2 px-3 text-white rounded-none outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <label className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold">&#187;</span> OBJECTIVE FREQUENCY
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      disabled={state === "transmitting"}
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#050507] border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 py-2 px-3 text-white rounded-none outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <label className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold">&#187;</span> RAW TRANSMISSION PAYLOAD
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      disabled={state === "transmitting"}
                      placeholder="Write your system specs, custom business integration requests, or general professional queries..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-[#050507] border border-zinc-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 py-2 px-3 text-white rounded-none outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={state === "transmitting"}
                      className="w-full py-3 bg-[#ffffff] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-cyan-400 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_-4px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                      {state === "transmitting" ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-black" />
                          [ COUPLING UPLINK SIGNAL... ]
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          [ TRANSMIT ENCRYPTED MESSAGE ]
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="transmission-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col justify-center items-center text-center space-y-6 pt-6"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.3)]">
                    <Check size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-mono text-sm text-emerald-400 uppercase tracking-widest font-bold">
                      {useMailtoFallback ? "[ CLIENT ROUTING INTENT INITIALIZED ]" : "[ TELEMETRY UPLINK SUCCESSFUL ]"}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                      {useMailtoFallback ? (
                        "The transmission has been transferred to your system's default email program. Please review the pre-filled email details and click Send inside your mail app to finish dispatching."
                      ) : (
                        "The transmission has been safely encrypted and transferred automatically via our server-side gateway. Jeeva has been notified directly with zero local mail client actions!"
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs uppercase hover:bg-white hover:text-black transition-colors rounded-none"
                  >
                    [ RE-ARM GATEWAY TRANSCEIVER ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TELEMETRY READOUT / TERMINAL LOG PANEL */}
          <div className="md:col-span-5 flex flex-col justify-between border border-zinc-800 bg-[#050506]/98 p-5 rounded-sm font-mono text-xs select-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                  <Terminal size={12} className="text-cyan-400 animate-pulse" />
                  <span>TRANSCIEVER TRACE</span>
                </div>
                <span className="text-[10px] text-zinc-500">GATEWAY NOMINAL</span>
              </div>

              {/* Dynamic Uplink Status Lines */}
              <div className="space-y-2 min-h-[160px] text-zinc-400 leading-relaxed">
                <div>
                  <span className="text-zinc-600 font-bold">STATUS:</span> READY FOR HANDSHAKE
                </div>
                {state === "idle" && (
                  <div className="text-zinc-600 max-w-sm italic">
                    Waiting for inbound packet validation. Feed sender properties in direct registers to stabilize transmission pathway values...
                  </div>
                )}
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 text-[11px]">
                    <span className="text-cyan-500/70">&#187;</span>
                    <span className={log.includes("COMPLETE") ? "text-emerald-400 font-bold" : ""}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Metrics */}
            <div className="bg-zinc-950/80 border border-zinc-900 px-3 py-3 space-y-1.5 text-[10px] text-zinc-500 mt-4 md:mt-0">
              <div className="flex justify-between">
                <span>COMMS FREQUENCY:</span>
                <span className="text-white">5.82 GHz (DIRECT-UPLINK)</span>
              </div>
              <div className="flex justify-between">
                <span>AES_STRENGTH:</span>
                <span className="text-emerald-400">GCM-256 (ARMED)</span>
              </div>
              <div className="flex justify-between">
                <span>BUFFER INDEX:</span>
                <span className="text-amber-500">JPCORE // MAIL_RELAY</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
