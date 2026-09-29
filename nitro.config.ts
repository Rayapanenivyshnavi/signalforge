import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  runtimeConfig: {
    hindsightUrl: "",
    hindsightApiKey: "",
    hindsightBankId: "signalforge-demo",
    groqApiKey: "",
  },
});
