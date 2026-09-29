import { defineHandler } from "nitro";
import { competitorEvents, competitors, competitorSummary, eventsFor } from "../../lib/competitor-data";
import { memoryStatus } from "../../lib/hindsight";

export default defineHandler(() => ({
  syntheticLabel: "Synthetic Demo Data",
  competitors: competitors.map((name) => ({
    ...competitorSummary(name),
    events: eventsFor(name),
  })),
  totalEvents: competitorEvents.length,
  memory: memoryStatus(),
}));
