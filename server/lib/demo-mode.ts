import { eventsFor, type CompetitorEvent } from "./competitor-data";

type DemoAnalysis = {
  source: "synthetic-demo";
  analysis: {
    headline: string;
    answer: string;
    observedFacts: string[];
    inferredSignal: string;
    whyItMatters: string;
    recommendedTopics: string[];
    confidence: "high" | "medium";
  };
  evidence: CompetitorEvent[];
  memories: [];
  reflection: null;
  demoNotice: string;
  question: string;
};

const focusCategories = (events: CompetitorEvent[]) => {
  const counts = events.reduce<Record<string, number>>((result, item) => {
    result[item.category] = (result[item.category] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 2)
    .map(([category]) => category);
};

export const generateSyntheticAnalysis = (competitor: string, question: string, strategic: boolean): DemoAnalysis => {
  const events = eventsFor(competitor);
  const recentEvents = events.slice(-6);
  const evidence = strategic
    ? events.filter((item) => item.importance >= 4).slice(-6)
    : recentEvents;
  const [primaryFocus = "Product", secondaryFocus = "Customer"] = focusCategories(events);
  const recentTitles = recentEvents.slice(0, 3).map((item) => item.title).join("; ");

  return {
    source: "synthetic-demo",
    analysis: {
      headline: strategic
        ? `${competitor} shows a concentrated ${primaryFocus.toLowerCase()} and ${secondaryFocus.toLowerCase()} motion`
        : `${competitor} has made several notable moves recently`,
      answer: `${competitor} has ${events.length} synthetic events across the six-month window. Recent activity includes ${recentTitles}. The dataset shows repeated ${primaryFocus.toLowerCase()} and ${secondaryFocus.toLowerCase()} activity.`,
      observedFacts: evidence.map((item) => `${item.date}: ${item.title} (${item.category})`),
      inferredSignal: `The repeated ${primaryFocus.toLowerCase()} and ${secondaryFocus.toLowerCase()} activity suggests a coordinated strategic focus rather than isolated launches. This is an inference from Synthetic Demo Data, not a live Hindsight conclusion.`,
      whyItMatters: `This pattern gives the team a focused set of topics to pressure-test in a meeting: ${primaryFocus.toLowerCase()} priorities, ${secondaryFocus.toLowerCase()} investment, and how the recent moves fit together.`,
      recommendedTopics: [
        `Ask how ${primaryFocus.toLowerCase()} priorities are changing buyer value`,
        `Probe the connection between ${secondaryFocus.toLowerCase()} activity and go-to-market focus`,
        "Clarify which recent move is most important to customers",
      ],
      confidence: evidence.length >= 4 ? "high" : "medium",
    },
    evidence,
    memories: [],
    reflection: null,
    demoNotice: "Synthetic Demo Data only. Hindsight was unavailable, so no live Hindsight memories were used.",
    question,
  };
};

export const generateSyntheticBrief = (competitor: string, meetingType: string, question?: string) => {
  const briefQuestion = question?.trim() || `Prepare me for a ${meetingType} with ${competitor}. What recent activity, historical patterns, and strategic signals should I know?`;
  return {
    ...generateSyntheticAnalysis(competitor, briefQuestion, true),
    meetingType,
    question: briefQuestion,
  };
};
