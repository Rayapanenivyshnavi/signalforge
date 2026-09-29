import { useRuntimeConfig } from "nitro/runtime-config";
import { competitorEvents, eventsFor, type CompetitorEvent } from "./competitor-data";

type MemoryHit = {
  id?: string;
  content?: string;
  text?: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

type MemoryResponse = {
  memories: MemoryHit[];
  raw: unknown;
};

type HindsightConfig = {
  url: string;
  apiKey: string;
  bankId: string;
};

const getConfig = (): HindsightConfig => {
  const runtime = useRuntimeConfig() as Record<string, string | undefined>;
  return {
    url: runtime.hindsightUrl || process.env.NITRO_HINDSIGHT_URL || process.env.HINDSIGHT_URL || "",
    apiKey: runtime.hindsightApiKey || process.env.NITRO_HINDSIGHT_API_KEY || process.env.HINDSIGHT_API_KEY || "",
    bankId: runtime.hindsightBankId || process.env.NITRO_HINDSIGHT_BANK_ID || process.env.HINDSIGHT_BANK_ID || "signalforge-demo",
  };
};

export const memoryStatus = () => {
  const config = getConfig();
  return {
    configured: Boolean(config.url && config.apiKey),
    provider: "Hindsight",
    bankId: config.bankId,
    message: config.url && config.apiKey
      ? "Hindsight memory layer is configured."
      : "Add HINDSIGHT_URL and HINDSIGHT_API_KEY on the server to activate long-term memory.",
  };
};

const requestHindsight = async (path: string, body: unknown) => {
  const config = getConfig();
  if (!config.url || !config.apiKey) {
    throw new Error("Hindsight is not configured. Add HINDSIGHT_URL and HINDSIGHT_API_KEY to the server environment.");
  }

  const response = await fetch(`${config.url.replace(/\/$/, "")}/v1/default/banks/${config.bankId}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Hindsight ${response.status}: ${detail.slice(0, 240)}`);
  }

  return response.json();
};

export const retainCompetitorEvent = async (item: CompetitorEvent) => {
  return requestHindsight("memories", {
    content: `[${item.id}] ${item.competitor} | ${item.date} | ${item.category} | ${item.title}\n${item.description}\nSource: ${item.sourceType}. Importance: ${item.importance}/5. This is Synthetic Demo Data.`,
    context: `Competitor intelligence event for ${item.competitor}`,
    metadata: {
      eventId: item.id,
      competitor: item.competitor,
      date: item.date,
      category: item.category,
      sourceType: item.sourceType,
      importance: item.importance,
      synthetic: true,
    },
  });
};

export const recallCompetitorHistory = async (competitor: string, question: string, maxTokens = 4800): Promise<MemoryResponse> => {
  const raw = await requestHindsight("memories/recall", {
    query: `${competitor}: ${question}`,
    max_tokens: maxTokens,
    types: ["world", "experience", "observation"],
  });
  return { memories: extractMemories(raw), raw };
};

export const reflectOnCompetitor = async (competitor: string, question: string) => {
  return requestHindsight("reflect", {
    query: `${competitor}: ${question}`,
    budget: "mid",
    context: "Identify an inferred competitive pattern from recalled historical memories. Separate observed facts from inference and cite the memory evidence.",
  });
};

const extractMemories = (raw: any): MemoryHit[] => {
  const candidates = raw?.memories || raw?.results || raw?.items || raw?.data?.memories || raw?.data?.results || [];
  if (!Array.isArray(candidates)) return [];
  return candidates.map((item: any) => ({
    id: item.id,
    content: item.content || item.text || item.memory || item.document,
    text: item.text,
    score: item.score,
    metadata: item.metadata,
  }));
};

const memoryText = (memories: MemoryHit[]) => memories
  .map((memory) => memory.content || memory.text || JSON.stringify(memory))
  .filter(Boolean)
  .join("\n\n");

const extractEvidenceEvents = (memories: MemoryHit[], competitor: string) => {
  const text = memoryText(memories);
  return eventsFor(competitor).filter((item) => text.includes(`[${item.id}]`));
};

const callGroq = async (system: string, user: string) => {
  const runtime = useRuntimeConfig() as Record<string, string | undefined>;
  const apiKey = runtime.groqApiKey || process.env.NITRO_GROQ_API_KEY || process.env.GROQ_API_KEY || "";
  if (!apiKey) throw new Error("Groq is not configured. Add GROQ_API_KEY to the server environment.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Groq ${response.status}: ${detail.slice(0, 240)}`);
  }
  const payload = await response.json() as any;
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty analysis.");
  return JSON.parse(content.replace(/^```json\s*/, "").replace(/\s*```$/, ""));
};

const analysisSystem = `You are SignalForge, a competitive intelligence analyst. Use ONLY the Hindsight memories supplied by the user. Never invent facts or evidence. Return valid JSON with keys: headline (string), answer (string), observedFacts (string[]), inferredSignal (string), whyItMatters (string), recommendedTopics (string[]), confidence ("high"|"medium"|"low"). Clearly label observed facts separately from inferred signal. Keep the answer concise and useful for a sales or product team.`;

export const generateCompetitiveAnalysis = async (competitor: string, question: string, strategic = false) => {
  const recalled = await recallCompetitorHistory(competitor, question);
  if (!recalled.memories.length) {
    throw new Error(`Hindsight returned no memories for ${competitor}. Retain the synthetic dataset before asking the agent.`);
  }
  const reflection = strategic ? await reflectOnCompetitor(competitor, question) : null;
  const evidence = extractEvidenceEvents(recalled.memories, competitor);
  const prompt = [
    `Competitor: ${competitor}`,
    `Question: ${question}`,
    `Hindsight recalled memories:\n${memoryText(recalled.memories)}`,
    reflection ? `Hindsight reflection:\n${JSON.stringify(reflection)}` : "",
    `Evidence event records available for citation:\n${JSON.stringify(evidence)}`,
  ].filter(Boolean).join("\n\n");
  const analysis = await callGroq(analysisSystem, prompt);
  return { analysis, evidence, memories: recalled.memories, reflection };
};

export const generateCompetitiveBrief = async (competitor: string, meetingType: string, question?: string) => {
  const briefQuestion = question?.trim() || `Prepare me for a ${meetingType} with ${competitor}. What recent activity, historical patterns, and strategic signals should I know?`;
  const result = await generateCompetitiveAnalysis(competitor, briefQuestion, true);
  return { ...result, meetingType, question: briefQuestion };
};

export const seedHindsight = async () => {
  const results = [];
  for (const item of competitorEvents) {
    try {
      await retainCompetitorEvent(item);
      results.push({ id: item.id, retained: true });
    } catch (error) {
      return {
        ok: false,
        retained: results.length,
        total: competitorEvents.length,
        error: error instanceof Error ? error.message : "Hindsight retain failed.",
      };
    }
  }
  return { ok: true, retained: results.length, total: competitorEvents.length };
};
