import { defineHandler } from "nitro";
import { createError, readBody } from "nitro/h3";
import { competitors } from "../../lib/competitor-data";
import { generateBriefWithDemoFallback } from "../../lib/intelligence";

type BriefBody = {
  competitor?: string;
  meetingType?: string;
  question?: string;
};

export default defineHandler(async (event) => {
  const body = await readBody<BriefBody>(event);
  const competitor = body?.competitor?.trim();
  const meetingType = body?.meetingType?.trim();
  if (!competitor || !competitors.includes(competitor as typeof competitors[number])) {
    throw createError({ statusCode: 400, statusMessage: "Select a valid competitor." });
  }
  if (!meetingType) {
    throw createError({ statusCode: 400, statusMessage: "Select a meeting type." });
  }

  try {
    return await generateBriefWithDemoFallback(competitor, meetingType, body.question);
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: error instanceof Error ? error.message : "Unable to generate the sales meeting brief.",
    });
  }
});
