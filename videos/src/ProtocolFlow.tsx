import React from "react";
import { Bot, PenLine } from "lucide-react";
import { AbsoluteFill } from "remotion";
import timeline from "../public/voice/protocol-flow/timeline.json";
import { Arrow, Narrated, Pill, PopIn, Typewriter, narratedFrames, theme, useAppear } from "./kit";

const ENS_NAME = "claims.acme.137.6022.eth";
const CALLER_ENS = "assistant.marie.137.6022.eth";
const ORIGIN = "https://claims.example.com";
const AGENT_WALLET = "0x7a3F…9c91";

// Where the two agents stand, and where arrows between them start and end.
const CALLER = { x: 330, y: 620 };
const CALLEE = { x: 1590, y: 620 };
const CALLER_EDGE = CALLER.x + 170;
const CALLEE_EDGE = CALLEE.x - 170;

export const PROTOCOL_FLOW_DURATION = narratedFrames(timeline);

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 20% 10%, ${theme.accentSoft} 0%, ${theme.bg} 55%)`,
    }}
  />
);

// Agent is the round badge that stands for one agent in the diagrams.
const Agent: React.FC<{ name: string; caption: string; x: number; y: number }> = ({ name, caption, x, y }) => (
  <PopIn at={0} style={{ position: "absolute", left: x - 150, top: y - 110, width: 300, textAlign: "center", fontFamily: theme.sans }}>
    <div
      style={{
        width: 140,
        height: 140,
        margin: "0 auto",
        borderRadius: 999,
        background: theme.panelRaised,
        border: `3px solid ${theme.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Bot size={72} color={theme.fg} strokeWidth={1.6} />
    </div>
    <div style={{ color: theme.fg, fontSize: 34, fontWeight: 600, marginTop: 16 }}>{name}</div>
    <div style={{ color: theme.muted, fontSize: 28, marginTop: 4 }}>{caption}</div>
  </PopIn>
);

const FadeUp: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const t = useAppear(at);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)`, ...style }}>{children}</div>;
};

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; highlight?: boolean }> = ({ children, style, highlight }) => (
  <div
    style={{
      background: theme.panel,
      border: `2px solid ${highlight ? theme.accent : theme.border}`,
      borderRadius: theme.radius,
      padding: 32,
      color: theme.fg,
      fontFamily: theme.sans,
      ...style,
    }}
  >
    {children}
  </div>
);

const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: theme.mono, whiteSpace: "pre", ...style }}>{children}</span>
);

const StepTitle: React.FC<{ index: number; title: string; subtitle?: string }> = ({ index, title, subtitle }) => {
  const t = useAppear(0, 12);
  return (
    <div style={{ position: "absolute", left: 120, top: 80, opacity: t, fontFamily: theme.sans, color: theme.fg }}>
      <div style={{ fontSize: 28, color: theme.accent, fontWeight: 600, letterSpacing: 2 }}>STEP {index}</div>
      <div style={{ fontSize: 64, fontWeight: 700, marginTop: 8 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 30, color: theme.muted, marginTop: 12 }}>{subtitle}</div>}
    </div>
  );
};

const Check: React.FC<{ at: number; label: string }> = ({ at, label }) => (
  <PopIn
    at={at}
    scale={0.6}
    origin="left center"
    style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.sans, fontSize: 30, color: theme.fg }}
  >
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        background: theme.accent,
        color: theme.bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
      }}
    >
      ✓
    </span>
    {label}
  </PopIn>
);

const Resolve: React.FC = () => (
  <AbsoluteFill>
    <StepTitle index={1} title="Resolve the name" subtitle="The caller only knows an ENS name." />
    <Agent name="assistant" caption={CALLER_ENS} {...CALLER} />
    <Arrow at={40} x1={CALLER_EDGE} x2={880} y={CALLER.y} label="lookup" color={theme.accent} />
    <FadeUp at={10} style={{ position: "absolute", left: 120, top: 830 }}>
      <div style={{ color: theme.muted, fontFamily: theme.sans, fontSize: 26, marginBottom: 12 }}>Looking up</div>
      <Panel style={{ padding: "18px 28px", fontSize: 34 }}>
        <Mono>
          <Typewriter text={ENS_NAME} at={12} />
        </Mono>
      </Panel>
    </FadeUp>
    <FadeUp at={55} style={{ position: "absolute", left: 920, top: 420, width: 860 }}>
      <Panel highlight>
        <div style={{ fontSize: 28, color: theme.muted, marginBottom: 20 }}>ENS records</div>
        <div style={{ fontSize: 34, lineHeight: 1.8 }}>
          <Mono style={{ color: theme.muted }}>url </Mono>
          <Mono>{ORIGIN}</Mono>
          <br />
          <Mono style={{ color: theme.muted }}>addr </Mono>
          <Mono>{AGENT_WALLET}</Mono>
        </div>
        <div style={{ fontSize: 30, color: theme.muted, marginTop: 20 }}>
          Resolves in any ENS client.
        </div>
      </Panel>
    </FadeUp>
  </AbsoluteFill>
);

const DocCard: React.FC<{ path: string; lines: string[]; at: number; x: number }> = ({ path, lines, at, x }) => (
  <FadeUp at={at} style={{ position: "absolute", left: x, top: 330, width: 820 }}>
    <Panel>
      <Mono style={{ fontSize: 30, color: theme.accent }}>{path}</Mono>
      <div style={{ marginTop: 20, fontSize: 32, lineHeight: 1.6, color: theme.fg, fontFamily: theme.sans }}>
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </Panel>
  </FadeUp>
);

const Verify: React.FC = () => (
  <AbsoluteFill>
    <StepTitle index={2} title="Verify who answers" subtitle="Two signed files on the agent's site." />
    <DocCard
      path="/.well-known/6022"
      at={10}
      x={120}
      lines={["Its 6022 name", "How it accepts payment", "Signed by its wallet"]}
    />
    <DocCard
      path="/.well-known/agent-card.json"
      at={25}
      x={980}
      lines={["Where to send messages", "What it can do", "Signed by its wallet"]}
    />
    <div style={{ position: "absolute", left: 120, top: 790, display: "flex", flexDirection: "column", gap: 22 }}>
      <Check at={45} label="Same key signed both files" />
      <Check at={65} label={`That key is the name's wallet, ${AGENT_WALLET}`} />
      <Check at={85} label="The agent card gives the A2A endpoint" />
    </div>
  </AbsoluteFill>
);

const Call: React.FC = () => {
  const noMoney = useAppear(100, 12);
  return (
    <AbsoluteFill>
      <StepTitle index={3} title="Send the message" subtitle="Over A2A. The agent may ask to be paid." />
      <Agent name="assistant" caption={CALLER_ENS} {...CALLER} />
      <Agent name="claims" caption={ENS_NAME} {...CALLEE} />
      <Arrow at={10} x1={CALLER_EDGE} x2={CALLEE_EDGE} y={540} label="message" />
      <Arrow at={40} x1={CALLEE_EDGE} x2={CALLER_EDGE} y={CALLER.y} label="402 · pay 0.01 USDC" color={theme.warn} />
      <PopIn at={75} scale={0.7} style={{ position: "absolute", left: 190, top: 800 }}>
        <Pill tone="warn">
          <PenLine size={26} /> signs the payment
        </Pill>
      </PopIn>
      <Arrow at={100} x1={CALLER_EDGE} x2={CALLEE_EDGE} y={720} label="message + signed payment" color={theme.accent} />
      <div style={{ position: "absolute", left: 120, bottom: 70, opacity: noMoney }}>
        <Pill style={{ fontSize: 36, padding: "12px 28px" }}>No money has moved yet.</Pill>
      </div>
    </AbsoluteFill>
  );
};

const Answer: React.FC = () => (
  <AbsoluteFill>
    <StepTitle index={4} title="Get the answer" subtitle="Paid only because it answered." />
    <Agent name="assistant" caption={CALLER_ENS} {...CALLER} />
    <Agent name="claims" caption={ENS_NAME} {...CALLEE} />
    <Arrow at={10} x1={CALLEE_EDGE} x2={CALLER_EDGE} y={560} label="200 · answer" color={theme.accent} />
    <PopIn at={30} origin="left top" style={{ position: "absolute", left: 560, top: 640, width: 800 }}>
      <Panel style={{ fontSize: 30, lineHeight: 1.5 }}>
        “Yes, up to €5,000, after a €150 deductible. File the claim within 30 days.”
      </Panel>
    </PopIn>
    <div style={{ position: "absolute", left: 560, top: 880, display: "flex", gap: 20 }}>
      <FadeUp at={60}>
        <Pill tone="accent" style={{ fontSize: 34 }}>Paid · tx 0x5b1e…04d2</Pill>
      </FadeUp>
      <FadeUp at={80}>
        <Pill style={{ fontSize: 34 }}>No answer, no charge</Pill>
      </FadeUp>
    </div>
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const runtimes = ["6022 Agent", "Hermes", "OpenClaw", "Yours"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: theme.sans }}>
      <FadeUp at={0}>
        <div style={{ color: theme.fg, fontSize: 70, fontWeight: 700, textAlign: "center" }}>
          Same protocol, any runtime
        </div>
      </FadeUp>
      <div style={{ display: "flex", gap: 24, marginTop: 60 }}>
        {runtimes.map((runtime, i) => (
          <FadeUp key={runtime} at={12 + i * 8}>
            <Pill tone={i === 0 ? "accent" : "plain"} style={{ fontSize: 40, padding: "18px 36px" }}>
              {runtime}
            </Pill>
          </FadeUp>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ProtocolFlow: React.FC = () => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <Background />
    <Narrated video="protocol-flow" timeline={timeline} scenes={[<Resolve />, <Verify />, <Call />, <Answer />, <Outro />]} />
  </AbsoluteFill>
);
