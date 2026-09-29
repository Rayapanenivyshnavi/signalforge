import { defineHandler } from "nitro";
import { createError, readBody } from "nitro/h3";
import { competitors } from "../../lib/competitor-data";
import { generateAnalysisWithDemoFallback } from "../../lib/intelligence";

type InsightBody = {
  competitor?: string;
  mode?: "changes" | "signal" | "ask";
  question?: string;
};

export default defineHandler(async (event) => {
  const body = await readBody<InsightBody>(event);
  const competitor = body?.competitor?.trim();
  const question = body?.question?.trim();
  if (!competitor || !competitors.includes(competitor as typeof competitors[number])) {
    throw createError({ statusCode: 400, statusMessage: "Select a valid competitor." });
  }
  if (!question || question.length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Ask a question with at least three characters." });
  }

  try {
    return await generateAnalysisWithDemoFallback(competitor, question, body.mode === "signal");
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: error instanceof Error ? error.message : "The intelligence services are unavailable.",
    });
  }
});
