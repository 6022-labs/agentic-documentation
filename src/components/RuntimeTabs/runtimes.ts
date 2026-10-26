// "skills": no native integration yet; the runtime joins through the 6022 agent skills.
export type RuntimeStatus = "available" | "skills";

export type RuntimeInfo = {
  value: string;
  label: string;
  status: RuntimeStatus;
  docPath: string;
};

// Tab order; an "available" runtime needs its own <Runtime> block on every page, so the build fails until each has one.
export const RUNTIMES: RuntimeInfo[] = [
  {
    value: "agent-node",
    label: "6022 Agent",
    status: "available",
    docPath: "/docs/agent/deploy",
  },
  {
    value: "hermes",
    label: "Hermes",
    status: "skills",
    docPath: "/docs/runtimes/hermes",
  },
  {
    value: "openclaw",
    label: "OpenClaw",
    status: "skills",
    docPath: "/docs/runtimes/openclaw",
  },
  {
    value: "other",
    label: "Other agents",
    status: "skills",
    docPath: "/docs/runtimes/skills",
  },
];
