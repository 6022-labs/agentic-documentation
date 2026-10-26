import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// The console scenes import real components from agentic-agent-node/web, checked out next to this repo.
// Paths resolve from videos/, where the npm scripts run; style.css and tsconfig.json use the same relative path.
const agentNodeWeb = path.resolve("../../agentic-agent-node/web");

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(20);

Config.overrideBundlerConfig((current) => {
  const config = enableTailwind(current);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias as Record<string, string>),
        "@": path.join(agentNodeWeb, "src"),
        // One React for the compositions and the console components.
        react: path.resolve("node_modules/react"),
        "react-dom": path.resolve("node_modules/react-dom"),
        // Console-only dependency, resolved from the console's own install.
        "react-blockies": path.join(agentNodeWeb, "node_modules/react-blockies"),
      },
    },
  };
});
