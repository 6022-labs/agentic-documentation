import React from "react";
import { AbsoluteFill } from "remotion";
import { Arrow, Pill, theme, useAppear } from "./kit";

const LANES = [
  { name: "Caller", caption: "any agent with a wallet", x: 330 },
  { name: "Agent", caption: "the paid service", x: 960 },
  { name: "Facilitator", caption: "x402: checks and settles", x: 1590 },
];

const TOP = 200;
const ROW = 76;
const START = 30;
const STEP = 34;
const TONES = { accent: theme.accent, warn: theme.warn };

type Message = { from: number; to: number; label: string; tone?: "accent" | "warn" };

const MESSAGES: Message[] = [
  { from: 0, to: 1, label: "message" },
  { from: 1, to: 0, label: "402 · pay 0.01 USDC to the agent", tone: "warn" },
  { from: 0, to: 0, label: "sign payment" },
  { from: 0, to: 1, label: "message + signed payment" },
  { from: 1, to: 2, label: "verify" },
  { from: 2, to: 1, label: "valid" },
  { from: 1, to: 1, label: "answer" },
  { from: 1, to: 2, label: "settle, only if answered" },
  { from: 2, to: 1, label: "tx hash", tone: "accent" },
  { from: 1, to: 0, label: "200 · answer + receipt", tone: "accent" },
];

// The closing rules follow the last message, one at a time, long enough to read; the last one stays up a little longer.
const NOTES = ["No answer? No charge.", "Payment fails? No answer.", "Free? The signature just says who's calling."];
const NOTES_AT = START + MESSAGES.length * STEP + 20;
const NOTE_FRAMES = 90;
const LAST_NOTE_HOLD = 20;

export const X402_EXCHANGE_DURATION = NOTES_AT + NOTES.length * NOTE_FRAMES + LAST_NOTE_HOLD;

const Lane: React.FC<{ name: string; caption: string; x: number }> = ({ name, caption, x }) => {
  const t = useAppear(0, 15);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 260,
          top: 50,
          width: 520,
          textAlign: "center",
          opacity: t,
          fontFamily: theme.sans,
        }}
      >
        <div style={{ color: theme.fg, fontSize: 44, fontWeight: 700 }}>{name}</div>
        <div style={{ color: theme.muted, fontSize: 28, marginTop: 4 }}>{caption}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 1,
          top: TOP - 30,
          width: 2,
          height: (MESSAGES.length + 0.6) * ROW * t,
          background: theme.border,
        }}
      />
    </>
  );
};

// SelfNote marks an action a lane performs on its own, instead of an arrow.
const SelfNote: React.FC<{ at: number; x: number; y: number; label: string }> = ({ at, x, y, label }) => {
  const t = useAppear(at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x + 24,
        top: y - 22,
        opacity: t,
        color: theme.muted,
        fontFamily: theme.mono,
        fontSize: 30,
        borderLeft: `4px solid ${theme.accent}`,
        paddingLeft: 14,
      }}
    >
      {label}
    </div>
  );
};

const Note: React.FC<{ at: number; until: number; children: React.ReactNode }> = ({ at, until, children }) => {
  const t = useAppear(at, 10) * (1 - useAppear(until - 8, 8));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", opacity: t }}>
      <Pill tone="accent" style={{ fontSize: 36, padding: "12px 30px" }}>
        {children}
      </Pill>
    </div>
  );
};

export const X402Exchange: React.FC = () => (
  <AbsoluteFill style={{ background: theme.bg }}>
    {LANES.map((lane) => (
      <Lane key={lane.name} {...lane} />
    ))}
    {MESSAGES.map((message, i) => {
      const at = START + i * STEP;
      const y = TOP + i * ROW;
      const x1 = LANES[message.from].x;
      const x2 = LANES[message.to].x;
      if (message.from === message.to) {
        return <SelfNote key={message.label} at={at} x={x1} y={y} label={message.label} />;
      }
      const pad = x2 > x1 ? 14 : -14;
      return (
        <Arrow
          key={message.label}
          at={at}
          x1={x1 + pad}
          x2={x2 - pad}
          y={y + 14}
          label={<span style={{ fontSize: 30 }}>{message.label}</span>}
          color={message.tone ? TONES[message.tone] : theme.fg}
        />
      );
    })}
    {NOTES.map((note, i) => {
      const at = NOTES_AT + i * NOTE_FRAMES;
      return (
        <Note key={note} at={at} until={i === NOTES.length - 1 ? X402_EXCHANGE_DURATION : at + NOTE_FRAMES}>
          {note}
        </Note>
      );
    })}
  </AbsoluteFill>
);
