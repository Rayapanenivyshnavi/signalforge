export type EventCategory = "Product" | "Pricing" | "Hiring" | "Partnership" | "Marketing" | "Expansion" | "AI" | "Customer";

export type CompetitorEvent = {
  id: string;
  competitor: string;
  date: string;
  category: EventCategory;
  title: string;
  description: string;
  sourceType: string;
  importance: 1 | 2 | 3 | 4 | 5;
};

export type Competitor = {
  competitor: string;
  eventCount: number;
  lastActivity: string | null;
  recentActivity: CompetitorEvent[];
  events: CompetitorEvent[];
};

export type AnalysisResult = {
  source: "hindsight" | "synthetic-demo";
  analysis: {
    headline: string;
    answer: string;
    observedFacts: string[];
    inferredSignal: string;
    whyItMatters: string;
    recommendedTopics: string[];
    confidence: "high" | "medium" | "low";
  };
  evidence: CompetitorEvent[];
  memories: { id?: string; content?: string; text?: string; score?: number }[];
  reflection?: unknown;
  demoNotice?: string;
};

export type ApiDataset = {
  syntheticLabel: string;
  competitors: Competitor[];
  totalEvents: number;
  memory: { configured: boolean; provider: string; bankId: string; message: string };
};

export const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));

export const formatShortDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));

export const apiRequest = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.statusMessage || payload?.message || `Request failed with status ${response.status}.`);
  return payload as T;
};
