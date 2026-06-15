export interface TerminalLine {
  id: string;
  type: "system" | "user" | "response" | "error";
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface TimelineEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  summary: string;
  details: string[];
  systemLoad: string; // e.g. "INFRA_STREAM // OK"
  metrics: { label: string; value: string }[];
}

export interface PayloadProject {
  id: string;
  title: string;
  category: string;
  content: string;
  visualType: "knowledge-os" | "goalmind" | "pulse-chennai" | "multimodal-svd";
  metric: string;
  status: string;
}
