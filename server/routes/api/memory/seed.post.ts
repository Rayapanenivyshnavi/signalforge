import { defineHandler } from "nitro";
import { competitorEvents } from "../../../lib/competitor-data";
import { seedHindsight } from "../../../lib/hindsight";

export default defineHandler(async () => {
  try {
    const result = await seedHindsight();
    if (result.ok) return result;

    return {
      ok: true,
      demoMode: true,
      retained: result.retained,
      total: result.total,
      message: "Demo mode active. Synthetic Demo Data remains available locally; no live Hindsight result is being claimed.",
      hindsightError: result.error,
    };
  } catch (error) {
    return {
      ok: true,
      demoMode: true,
      retained: 0,
      total: competitorEvents.length,
      message: "Demo mode active. Synthetic Demo Data remains available locally; no events were written to Hindsight.",
      hindsightError: error instanceof Error ? error.message : "Hindsight retain was unavailable.",
    };
  }
});
