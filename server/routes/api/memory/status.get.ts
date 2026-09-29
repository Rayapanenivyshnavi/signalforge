import { defineHandler } from "nitro";
import { memoryStatus } from "../../../lib/hindsight";

export default defineHandler(() => memoryStatus());
