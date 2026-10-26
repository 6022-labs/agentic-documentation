import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import BlockiesRaw from "react-blockies";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ExternalLink,
  Loader2,
  Moon,
  PlugZap,
  RefreshCw,
  RotateCcw,
  SendHorizontal,
  Trash2,
  X,
} from "lucide-react";

// Real building blocks of the 6022 Agent console (agentic-agent-node/web, aliased as "@"), so the video matches it.
import StepIndicator from "@/components/dashboard/identity/step-indicator";
import ChatTranscript, { type ChatMessage } from "@/components/dashboard/playground/chat-transcript";
import LlmConfigForm from "@/components/dashboard/llm/forms/llm-config-form";
import { configureNavItems, testNavItems, type NavItem } from "@/components/dashboard/nav-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import logo from "../../static/img/logo-192x192.png";
import { Cursor, Pill, PopIn, Typewriter, theme, useAppear, type CursorStop } from "./kit";

const Blockies = ((BlockiesRaw as unknown as { default?: typeof BlockiesRaw }).default ?? BlockiesRaw) as typeof BlockiesRaw;

const ENS_NAME = "claims.acme.80002.6022.eth";
const OWNER = "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE";
const AGENT_WALLET = "0x7a3F21c9b0E4d6A8f5B2c1D9e0A7b3C4d5E69c91";

// Console pages are laid out at 960x540 CSS pixels, then scaled 2x to fill the 1920x1080 frame, so text stays readable.
const SCALE = 2;

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  const frame = useCurrentFrame();
  return <Loader2 className={className ?? "size-4"} style={{ transform: `rotate(${frame * 12}deg)` }} />;
};

const NavGroup: React.FC<{ label: string; items: NavItem[]; active: string; hovered?: string }> = ({ label, items, active, hovered }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            {/* The console's `data-active:` variant matches the attribute's presence, so drop it on inactive items. */}
            <SidebarMenuButton
              asChild
              data-active={item.title === active ? true : undefined}
              className={item.title === hovered ? "bg-sidebar-accent text-sidebar-accent-foreground" : undefined}>
              <a>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

// Shell mirrors app-sidebar.tsx and dashboard-layout.tsx; the originals need auth, router and wallet providers.
const Shell: React.FC<{ active: string; hovered?: string; step: string; ensName?: string; overlay?: React.ReactNode; children: React.ReactNode }> = ({
  active,
  hovered,
  step,
  ensName,
  overlay,
  children,
}) => (
  <AbsoluteFill className="dark" style={{ background: theme.bg }}>
    {/* In the console `.dark` sits on <html>; here the wrapper also sets the inherited text colour. */}
    <div className="text-foreground" style={{ width: 960, height: 540, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
      <TooltipProvider>
        <SidebarProvider style={{ minHeight: 540, height: 540 }}>
          <Sidebar collapsible="none" className="h-[540px] border-r">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                    <a>
                      <Img src={logo} className="size-8 shrink-0 rounded-md" />
                      <div className="grid flex-1 text-left leading-tight">
                        <span className="truncate font-semibold">{ensName ?? "Agent node"}</span>
                        <span className="truncate text-xs text-muted-foreground">Agent console</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <NavGroup label="Configure" items={configureNavItems} active={active} hovered={hovered} />
              <NavGroup label="Test" items={testNavItems} active={active} hovered={hovered} />
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg">
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <Blockies seed={OWNER} />
                    </span>
                    <span className="flex-1 truncate text-left">0x3f5CE5…36f0bE</span>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="h-[540px] overflow-hidden">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-base font-semibold">{active}</h1>
              <div className="ml-auto">
                <Button variant="ghost" size="icon">
                  <Moon />
                </Button>
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      {overlay}
    </div>
    <StepCaption text={step} />
  </AbsoluteFill>
);

// StepCaption names the step in the empty middle of the page header, the one explanation a silent viewer needs.
const StepCaption: React.FC<{ text: string }> = ({ text }) => {
  const t = useAppear(0, 10);
  return (
    <div style={{ position: "absolute", top: 26, left: 900, opacity: t }}>
      <Pill tone="accent" style={{ fontSize: 36, padding: "10px 26px" }}>
        {text}
      </Pill>
    </div>
  );
};

const Toast: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const t = useAppear(at, 8);
  return (
    <div
      className="dark absolute flex items-center gap-2 rounded-lg border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg"
      style={{ right: 20, bottom: 20, opacity: t, transform: `translateY(${(1 - t) * 10}px)` }}>
      <CheckCircle2 className="size-4" />
      {text}
    </div>
  );
};

// Terminal beats: the URL finishes typing at 98, the caret idles, then the pointer hovers and clicks it.
const HOVERED = 132;
const CLICKED = 140;

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const leave = useAppear(CLICKED + 6, 10);
  const lines = [
    { at: 30, text: "✔ Network agent-node_default   Created" },
    { at: 34, text: "✔ Container agent-node-vault   Created" },
    { at: 38, text: "✔ Container agent-node-db      Created" },
    { at: 42, text: "✔ Container agent-node-ipfs    Created" },
    { at: 46, text: "  … grafana, loki, tempo       Created" },
    { at: 52, text: "✔ Container agent-node-host    Created" },
    { at: 58, text: "Attaching to agent-node-host, agent-node-db, …" },
  ];
  return (
    <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center", opacity: 1 - leave }}>
      <StepCaption text="1 · Start the agent" />
      <div
        style={{
          width: 1500,
          borderRadius: theme.radius,
          border: `2px solid ${theme.border}`,
          background: theme.panel,
          fontFamily: theme.mono,
          fontSize: 38,
          color: theme.fg,
          padding: "40px 48px",
          lineHeight: 1.6,
        }}>
        <div>
          <span style={{ color: theme.accent }}>$ </span>
          <Typewriter text="docker compose up" at={4} charsPerFrame={0.8} />
        </div>
        {lines.map((line) =>
          frame >= line.at ? (
            <div key={line.text} style={{ color: theme.muted, whiteSpace: "pre" }}>
              {line.text}
            </div>
          ) : null,
        )}
        {frame >= 62 ? (
          <div style={{ marginTop: 12, color: theme.accent }}>
            {"→ console at ".slice(0, Math.max(0, frame - 64))}
            <span style={{ textDecoration: frame >= HOVERED ? "underline" : "none" }}>
              <Typewriter text="http://localhost:5500" at={77} charsPerFrame={1} idleCaret={frame < HOVERED} />
            </span>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean; link?: boolean; hovered?: boolean }> = ({ label, value, mono, link, hovered }) => (
  <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 px-4 py-2.5">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="min-w-0">
      <span className={`flex items-center gap-1 text-sm ${mono ? "font-mono" : ""}`}>
        <span className={`truncate ${hovered ? "underline" : ""}`}>{value}</span>
        {link ? <ExternalLink className="size-3.5 shrink-0" /> : null}
      </span>
    </dd>
  </div>
);

// Identity beats: the mint confirms, a status refresh picks up the ENS records, then the wizard closes on the finished card.
const MINTED = 90;
const REFRESHED = 125;
const ENS_DONE = REFRESHED + 10;
const CLOSED = 175;
const ENS_HOVERED = 194;
const LLM_HOVERED = 222;

// IdentityDialog mirrors identity-wizard.tsx; Radix portals it to <body>, which would escape the 2x scale, so it's drawn inline.
const IdentityDialog: React.FC<{ frame: number }> = ({ frame }) => {
  const steps = [
    { label: "Details", done: true },
    { label: "Mint", done: frame >= MINTED },
    { label: "ENS", done: frame >= ENS_DONE },
  ];
  // The first unfinished step, or the last one once all are done.
  const current = steps.findIndex((step) => !step.done) + 1 || steps.length;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative grid w-[32rem] gap-4 rounded-lg border bg-background p-6 shadow-lg">
        <X className="absolute top-4 right-4 size-4 opacity-70" />
        <div className="flex flex-col gap-2">
          <div className="text-lg leading-none font-semibold">Identity setup</div>
          <div className="text-sm text-muted-foreground">Describe the agent, mint it on-chain, then publish its ENS records.</div>
        </div>
        <StepIndicator steps={steps} current={current} />
        <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          {steps[2].done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <Spinner className="mt-0.5 size-4 shrink-0" />}
          <span>
            {!steps[1].done
              ? "The mint transaction is being confirmed."
              : steps[2].done
                ? "The agent is minted and its ENS records are published."
                : "The ENS records transaction is being confirmed."}
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <RefreshCw />
          Refresh status
        </Button>
      </div>
    </div>
  );
};

// The identity page behind the wizard, then the finished card of identity/index.tsx.
const IdentityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const done = frame >= CLOSED;
  return (
    <Shell
      active="Identity"
      hovered={frame >= LLM_HOVERED ? "LLM" : undefined}
      step="3 · Create the identity"
      ensName={frame >= ENS_DONE ? ENS_NAME : undefined}
      overlay={done ? null : <IdentityDialog frame={frame} />}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>Identity</CardTitle>
              <CardDescription>
                {done
                  ? "The agent is minted and its ENS records are published."
                  : "Finish the setup to mint the agent and register its ENS."}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <RefreshCw />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight">claims</h2>
                <Badge variant="secondary">expert</Badge>
                <span className="ml-2 text-sm text-muted-foreground">Mint</span>
                <Badge>confirmed</Badge>
                <span className="ml-2 text-sm text-muted-foreground">ENS</span>
                <Badge>confirmed</Badge>
              </div>
              <dl className="divide-y rounded-lg border">
                <Row label="Token id" value="#42" />
                <Row label="Agent wallet" value={AGENT_WALLET} mono link />
                <Row label="ENS domain" value={ENS_NAME} mono link hovered={frame >= ENS_HOVERED && frame < ENS_HOVERED + 16} />
              </dl>
            </div>
          ) : (
            <div className="h-40" />
          )}
        </CardContent>
      </Card>
    </Shell>
  );
};

const Field: React.FC<{ label: string; value?: string; placeholder?: string; description?: string; select?: boolean }> = ({
  label,
  value,
  placeholder,
  description,
  select,
}) => (
  <div className="grid gap-2">
    <Label>{label}</Label>
    <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-input/30 px-3 text-sm shadow-xs">
      <span className={value ? "" : "text-muted-foreground"}>{value || placeholder}</span>
      {select ? <ChevronDown className="size-4 opacity-50" /> : null}
    </div>
    {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
  </div>
);

// LLM beats: the key is typed, the connection test runs, then the save.
const KEY_TYPED = 22;
const TESTING = 56;
const TESTED = 80;
const SAVING = 98;
const SAVED = 112;
const PLAYGROUND_HOVERED = 142;

// First setup mirrors llm-config-form (no config yet: no badge, no Remove); once saved, the real LlmConfigForm takes over.
const LlmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(24, Math.floor((frame - KEY_TYPED) * 1.2)));
  const testing = frame >= TESTING && frame < TESTED;
  const saved = frame >= SAVED;
  const config = { id: "1", provider: "anthropic", model: "claude-sonnet-5", setupStatus: "active", createdAt: "", updatedAt: "" };
  return (
    <Shell active="LLM" hovered={frame >= PLAYGROUND_HOVERED ? "Playground" : undefined} step="4 · Connect a model" ensName={ENS_NAME}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>LLM connection</CardTitle>
              <CardDescription>The provider that powers this agent's reasoning. One connection per agent.</CardDescription>
            </div>
            {saved ? <Badge>active</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {saved ? (
            <LlmConfigForm config={config} onFormComplete={async () => ({ ok: true }) as never} onValueChange={() => undefined} />
          ) : (
            <div className="space-y-4">
              <Field label="Provider" value="Anthropic" select />
              <Field label="Model" value="claude-sonnet-5" />
              <Field label="API key" value={"•".repeat(typed)} placeholder="sk-…" description="Stored in the node vault, never returned by the API." />
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between gap-2">
          {saved ? (
            <Button type="button" variant="destructive" size="sm">
              <Trash2 />
              Remove
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline">
              {testing ? <Spinner /> : <PlugZap />}
              Test connection
            </Button>
            <Button type="button" disabled={frame < TESTED}>
              {frame >= SAVING && !saved ? <Spinner /> : null}
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
      {frame >= TESTED && !saved ? <Toast at={TESTED} text="Connection established" /> : null}
      {saved ? <Toast at={SAVED} text="LLM configuration saved" /> : null}
    </Shell>
  );
};

const QUESTION: ChatMessage = {
  id: "1",
  author: "you",
  role: "user",
  content: "Who are you?",
  timestamp: "",
};

const ANSWER: ChatMessage = {
  id: "2",
  author: "claims",
  role: "assistant",
  content: `I'm claims, an insurance claims expert.\nOther agents can reach me as ${ENS_NAME}.`,
  timestamp: "",
  stats: "1.2 s · 96 tokens",
};

// Playground beats: the question is typed and sent, the agent thinks, then answers.
const QUESTION_TYPED = 22;
const SENT = 58;
const THINKING = 63;
const ANSWERED = 108;

// Mirrors playground/index.tsx around the real ChatTranscript.
const PlaygroundScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messages = frame < SENT ? [] : frame < ANSWERED ? [QUESTION] : [QUESTION, ANSWER];
  const typed = Math.max(0, Math.floor((frame - QUESTION_TYPED) * 0.6));
  return (
    <Shell active="Playground" step="5 · Talk to it" ensName={ENS_NAME}>
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>Playground</CardTitle>
              <CardDescription>Talk to the agent through the gateway's reasoning loop.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <RotateCcw />
              New chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            <Label className="shrink-0">System prompt</Label>
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">You are claims, an insurance claims expert.</span>
          </div>
          <ChatTranscript messages={messages} loadingHistory={false} sending={frame >= THINKING && frame < ANSWERED} scrollRef={scrollRef} />
          <div className="flex items-end gap-2">
            <Textarea
              readOnly
              value={frame < SENT ? QUESTION.content.slice(0, typed) : ""}
              placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
              className="max-h-32 min-h-11 flex-1"
            />
            <Button size="icon-lg">
              <SendHorizontal />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
};

// Sign-in (step 2 of the quickstart) is skipped: the scenes keep the page's step numbers.
const SCENES: { Scene: React.FC; frames: number; popIn?: boolean }[] = [
  { Scene: Terminal, frames: 160 },
  { Scene: IdentityScene, frames: 240, popIn: true },
  { Scene: LlmScene, frames: 160 },
  { Scene: PlaygroundScene, frames: 230 },
];

const sceneStart = (index: number): number => SCENES.slice(0, index).reduce((sum, { frames }) => sum + frames, 0);

// Frame coordinates (1920x1080) of what the pointer reaches; the console's are its 960x540 layout doubled.
const SPOT = {
  url: { x: 690, y: 792 },
  refreshStatus: { x: 960, y: 706 },
  ensDomain: { x: 1100, y: 616 },
  navLlm: { x: 140, y: 308 },
  apiKey: { x: 900, y: 698 },
  testConnection: { x: 1530, y: 874 },
  save: { x: 1765, y: 874 },
  navPlayground: { x: 160, y: 688 },
  message: { x: 900, y: 945 },
  send: { x: 1790, y: 950 },
};

const IDENTITY = sceneStart(1);
const LLM = sceneStart(2);
const PLAYGROUND = sceneStart(3);

// One pointer walks through every scene, so each change on screen follows a visible hover or click.
const CURSOR_PATH: CursorStop[] = [
  { at: 108, x: 1300, y: 1010 },
  { at: HOVERED, ...SPOT.url, shape: "pointer" },
  { at: CLICKED, ...SPOT.url, shape: "pointer", click: true },
  { at: CLICKED + 10, ...SPOT.url },
  { at: IDENTITY + 60, x: 1160, y: 860 },
  { at: IDENTITY + REFRESHED - 8, ...SPOT.refreshStatus, shape: "pointer" },
  { at: IDENTITY + REFRESHED, ...SPOT.refreshStatus, shape: "pointer", click: true },
  { at: IDENTITY + CLOSED, ...SPOT.refreshStatus },
  { at: IDENTITY + ENS_HOVERED, ...SPOT.ensDomain, shape: "pointer" },
  { at: IDENTITY + ENS_HOVERED + 16, ...SPOT.ensDomain },
  { at: IDENTITY + LLM_HOVERED, ...SPOT.navLlm, shape: "pointer" },
  { at: IDENTITY + 232, ...SPOT.navLlm, shape: "pointer", click: true },
  { at: LLM + KEY_TYPED - 4, ...SPOT.apiKey, shape: "text" },
  { at: LLM + KEY_TYPED - 2, ...SPOT.apiKey, shape: "text", click: true },
  { at: LLM + TESTING - 2, ...SPOT.testConnection, shape: "pointer" },
  { at: LLM + TESTING, ...SPOT.testConnection, shape: "pointer", click: true },
  { at: LLM + SAVING - 2, ...SPOT.save, shape: "pointer" },
  { at: LLM + SAVING, ...SPOT.save, shape: "pointer", click: true },
  { at: LLM + PLAYGROUND_HOVERED, ...SPOT.navPlayground, shape: "pointer" },
  { at: LLM + 152, ...SPOT.navPlayground, shape: "pointer", click: true },
  { at: PLAYGROUND + QUESTION_TYPED - 4, ...SPOT.message, shape: "text" },
  { at: PLAYGROUND + QUESTION_TYPED - 2, ...SPOT.message, shape: "text", click: true },
  { at: PLAYGROUND + SENT - 2, ...SPOT.send, shape: "pointer" },
  { at: PLAYGROUND + SENT, ...SPOT.send, shape: "pointer", click: true },
  { at: PLAYGROUND + SENT + 30, x: 1500, y: 800 },
];

export const AGENT_NODE_CONSOLE_DURATION = SCENES.reduce((sum, { frames }) => sum + frames, 0);

export const AgentNodeConsole: React.FC = () => (
  <AbsoluteFill>
    {SCENES.map(({ Scene, frames, popIn }, i) => (
      <Sequence key={i} from={sceneStart(i)} durationInFrames={frames}>
        {popIn ? (
          <PopIn at={0} scale={0.92} style={{ position: "absolute", inset: 0 }}>
            <Scene />
          </PopIn>
        ) : (
          <Scene />
        )}
      </Sequence>
    ))}
    <Cursor path={CURSOR_PATH} />
  </AbsoluteFill>
);
