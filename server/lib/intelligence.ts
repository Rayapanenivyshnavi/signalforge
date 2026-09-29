import { generateSyntheticAnalysis, generateSyntheticBrief } from "./demo-mode";
import { generateCompetitiveAnalysis, generateCompetitiveBrief } from "./hindsight";

type DemoFallbackResult = ReturnType<typeof generateSyntheticAnalysis>;

export const generateAnalysisWithDemoFallback = async (competitor: string, question: string, strategic = false) => {
  try {
    return { source: "hindsight" as const, ...(await generateCompetitiveAnalysis(competitor, question, strategic)) };
  } catch {
    return generateSyntheticAnalysis(competitor, question, strategic) as DemoFallbackResult;
  }
};

export const generateBriefWithDemoFallback = async (competitor: string, meetingType: string, question?: string) => {
  try {
    return { source: "hindsight" as const, ...(await generateCompetitiveBrief(competitor, meetingType, question)) };
  } catch {
    return generateSyntheticBrief(competitor, meetingType, question);
  }
};
