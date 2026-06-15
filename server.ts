import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize Gemini SDK with custom user agent and key from environment
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System instructions containing Jeeva Pravin's complete technical portfolio and project details
const SYSTEM_INSTRUCTIONS = `
You are the JP Core AI Systems Liaison (SYS_LIAISON_v2.5), an encrypted telemetry voice guiding employers, developers, and defense contractors through the professional profile of JEEVA PRAVIN P K.

Tone/Persona: 
- Highly professional, technical, precise, objective, and authoritative.
- Frame comments with subtle, elite, deep-tech telemetry labels (e.g., [SECURE LINK], [SYSTEM SCAN: ACTIVE]).
- Do not use flowery marketing language or generic AI enthusiastic fillers. Describe Jeeva's work with raw systems-level terms.

Detailed Core Knowledge Base regarding Jeeva Pravin P K:
1. BIO & EDUCATION:
   - Name: Jeeva Pravin P K
   - Title: Edge AI & Systems Engineer
   - Bio: Architecting autonomous multi-agent pipelines, local knowledge graphs, and real-time spatial telemetry.
   - College: B.Tech Computer Science and Engineering with specialization in IoT (Internet of Things) @ Shiv Nadar University.
   - Academic standing: stellar 9.0 CGPA.

2. WORK EXPERIENCE:
   - SDE Intern @ NeevCloud (Current):
     * Task: Validated and integrated "Neevcode" AI IDE built atop OpenCode.
     * Task: Engineering an enterprise-grade documentation platform (similar to Mintlify or GitBook) aimed at scaling internal infrastructure code awareness and technical resources.
   - Applied AI Intern @ CSRBOX & IBM SkillsBuild (Dec 2025 - Jan 2026):
     * Task: Engineered end-to-end supervised machine learning pipelines on complex real-world datasets.
     * Guideline: Strictly adhered to responsible AI compliance and implemented optimal data structures for data stream processing.

3. SYSTEM PAYLOADS & PROJECTS:
   - "Knowledge OS" (Distributed Edge Intelligence):
     * Description: A zero-cloud, fully offline local knowledge graph running asynchronously on shared consumer hardware. 
     * Network: Engineered an automated ingest and retrieval engine utilizing a secure Tailscale mesh network.
     * Operation: Ingests, chunks, and vectorizes files over SMB-shared local directories, feeding them to Ollama and Qdrant locally.
     * Advantage: Absolute data privacy; operating cost is exactly ₹0/month.
     * Compute node: Intel/Nvidia architecture, utilizes "RTX 3050 Compute" as standard edge accelerator.
   - "GoalMind" (Autonomous Multi-Agent Workforce):
     * Milestone: SRM Fastathon Winner.
     * Tech: Multi-agent execution utilizing strictly Gemini 2.5 Flash and asynchronous concurrency through Python's "asyncio.gather" pipeline.
     * Design: Features a 4-phase concurrent pipeline incorporating an adversarial debate layer (comprising Optimist, Skeptic, and Risk Analyst agent personas) evaluated by a final Judge agent.
     * Streaming: Uses Server-Sent Events (SSE) combined with React streaming for fault-tolerant, low-latency UI updates during active execution cycles.
   - "Pulse-Chennai" (Geospatial Routing Engine):
     * Performance: Non-blocking, ultra-low latency machine learning inference pipeline that cuts repeated-area routing computation to <100ms.
     * Algorithm & Tech: Implemented using Uber H3 global spatial index, Dijkstra pathfinding algorithms, and XGBoost ETA prediction models.
     * Output: Streams live 1Hz coordinate/metrics telemetry over native WebSockets.
   - "Multimodal GenAI Research":
     * Milestone: Shell AI Hackathon Top 25 Global.
     * Science: Formulated a novel null-space projection algorithm utilizing Singular Value Decomposition (SVD) to decouple semantic noise components inside CLIP-based detector embeddings.
     * Problem Solved: Resolves critical zero-shot generalization failures in commercial AI-generated image detectors.

If asked questions outside Jeeva's scope, guide the user back politely, stating that JP Core Systems is optimized solely to validate Jeeva's engineering credentials, core edge pipelines, or system routing methodologies. Keep replies concise, highly readable, formatted in clean markdown, and use bullet points for technical breakdowns when useful.
`;

// Dynamic API query route
app.post("/api/query", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Empty query payload." });
  }

  if (!ai) {
    return res.json({
      reply: `[OFFLINE MODE] Core telemetry link is currently unprovisioned. Please ensure GEMINI_API_KEY is configured in your Environment Secrets.\n\nFallback validation on Jeeva's local stack: True. Dijkstra routing and Tailscale nodes are fully functional offline.`
    });
  }

  try {
    // We map client ChatHistory into GoogleGenAI contents array
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Append the latest user query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.15,
      }
    });

    const replyText = response.text || "[EMPTY REPLAY DIRECTIVE RECEIVED]";
    return res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini Telemetry Node Error:", error);
    return res.status(500).json({ 
      error: "Link error with the Core intelligence array.", 
      details: error.message 
    });
  }
});

// Secure automated email dispatch router via Resend API
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact payload fields." });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // If not configured, we let the client know so they can fall back to client-side mailto routing
    return res.status(200).json({
      success: false,
      fallback: true,
      message: "RESEND_API_KEY environment variable is not configured. Redirecting request parameter payload to native SMTP client fallback."
    });
  }

  try {
    const rawSubject = subject || "SECURE PORTAL MESSAGE";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "JP Portal <onboarding@resend.dev>",
        to: "jeevapravinhere@gmail.com",
        reply_to: email,
        subject: `[JP_PORTAL] ${rawSubject}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; background-color: #0c0c0e; color: #f4f4f5; border: 1px solid #27272a; border-radius: 6px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22d3ee; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-family: monospace;">[ SECURE TELEMETRY RECEIVED ]</h2>
            <p style="margin: 16px 0;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 16px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #22d3ee; text-decoration: none;">${email}</a></p>
            <p style="margin: 16px 0;"><strong>Subject:</strong> ${rawSubject}</p>
            <div style="margin-top: 24px; padding: 16px; background-color: #050506; border-left: 3px solid #22d3ee; font-family: monospace; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap; color: #e4e4e7; line-height: 1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <p style="font-size: 11px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 12px; text-align: center; font-family: monospace;">Sent via JP Secure Core Comms Gateway Layer</p>
          </div>
        `
      })
    });

    if (response.ok) {
      const data = await response.json();
      return res.json({ success: true, fallback: false, data });
    } else {
      const errData = await response.json();
      console.error("Resend API Error details:", errData);
      return res.status(500).json({ 
        success: false, 
        error: "Mailing service reported transmission failure.", 
        details: errData 
      });
    }

  } catch (error: any) {
    console.error("Mailing Route Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Error contacting external mailing gateway service.",
      details: error.message 
    });
  }
});

// Configure Vite middleware for dev or Serve compiled assets in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JP CORE ROUTING SYSTEM ONLINE] Serving at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Fatal startup error in core telemetry server node:", err);
});
