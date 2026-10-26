import React from "react";
import { AbsoluteFill, Easing, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import logo from "../../static/img/logo-192x192.png";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import config from "../config.json";

const sans = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const FPS = config.fps;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Brand tokens, shared with the docs site (src/css/custom.css) and the 6022 Agent console.
export const theme = {
  bg: "#0a0a0a",
  panel: "#171717",
  panelRaised: "#262626",
  border: "#262626",
  fg: "#fafafa",
  muted: "#a1a1a1",
  accent: "#25c2a0",
  accentLight: "#1a7a66",
  accentSoft: "rgba(37, 194, 160, 0.14)",
  accentGlow: "rgba(37, 194, 160, 0.10)",
  warn: "#f5a524",
  warnSoft: "rgba(245, 165, 36, 0.14)",
  agent2: "#4f7cff",
  human: "#e8912d",
  radius: 20,
  sans: sans.fontFamily,
  mono: mono.fontFamily,
};

// useAppear eases a value from 0 to 1 over `duration` frames starting at `from`.
export const useAppear = (from: number, duration = 15): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

export const usePop = (from: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config: { damping: 14, mass: 0.6 } });
};

// PopIn springs its children in at `at`, growing from `scale` to full size.
export const PopIn: React.FC<{ at: number; scale?: number; origin?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at,
  scale = 0,
  origin = "center",
  style,
  children,
}) => {
  const s = usePop(at);
  return <div style={{ opacity: s, transform: `scale(${scale + (1 - scale) * s})`, transformOrigin: origin, ...style }}>{children}</div>;
};

// Typewriter types `text` from `at`; with `idleCaret` the caret keeps blinking once the line is done.
export const Typewriter: React.FC<{ text: string; at: number; charsPerFrame?: number; idleCaret?: boolean; style?: React.CSSProperties }> = ({
  text,
  at,
  charsPerFrame = 1,
  idleCaret = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const count = Math.max(0, Math.min(text.length, Math.floor((frame - at) * charsPerFrame)));
  const caretOn = (idleCaret || count < text.length) && Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, count)}
      <span style={{ opacity: caretOn ? 1 : 0 }}>▍</span>
    </span>
  );
};

export type CursorShape = "arrow" | "pointer" | "text";

// CursorStop: the pointer arrives at (x, y) at frame `at`, takes `shape` there, and clicks if `click` is set.
export type CursorStop = { at: number; x: number; y: number; shape?: CursorShape; click?: boolean };

// Each shape is drawn so its hotspot sits at the element's top-left corner.
const CURSOR_SHAPES: Record<CursorShape, { width: number; height: number; hotspot: { x: number; y: number }; svg: React.ReactNode }> = {
  arrow: {
    width: 44,
    height: 52,
    hotspot: { x: 2, y: 2 },
    svg: (
      <svg width={44} height={52} viewBox="0 0 22 26">
        <path d="M1 1 L1 20 L6 15.5 L9.5 24 L13 22.5 L9.5 14.5 L16 14.5 Z" fill="#fff" stroke="#0a0a0a" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    ),
  },
  pointer: {
    width: 50,
    height: 52,
    hotspot: { x: 20, y: 2 },
    svg: (
      <svg width={50} height={52} viewBox="0 0 25 26">
        <path
          d="M8.5 2.5 a1.5 1.5 0 0 1 3 0 V10 a1.5 1.5 0 0 1 3 0 V11 a1.5 1.5 0 0 1 3 0 V12 a1.5 1.5 0 0 1 3 0 V17.5 c0 3 -2.2 6 -5.5 6 H12.5 c-2 0 -3.3 -1 -4.5 -2.6 L4.2 15.6 a1.5 1.5 0 0 1 2.2 -2 L8.5 15.5 Z"
          fill="#fff"
          stroke="#0a0a0a"
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
        <path d="M11.5 10 V14 M14.5 11 V14 M17.5 12 V14.5" stroke="#0a0a0a" strokeWidth={1} strokeLinecap="round" />
      </svg>
    ),
  },
  text: {
    width: 22,
    height: 44,
    hotspot: { x: 11, y: 22 },
    svg: (
      <svg width={22} height={44} viewBox="0 0 11 22">
        <path d="M2 1.5 H4 Q5.5 1.5 5.5 3 V19 Q5.5 20.5 4 20.5 H2 M9 1.5 H7 Q5.5 1.5 5.5 3 M5.5 19 Q5.5 20.5 7 20.5 H9 M3.5 11 H7.5" fill="none" stroke="#0a0a0a" strokeWidth={3} strokeLinecap="round" />
        <path d="M2 1.5 H4 Q5.5 1.5 5.5 3 V19 Q5.5 20.5 4 20.5 H2 M9 1.5 H7 Q5.5 1.5 5.5 3 M5.5 19 Q5.5 20.5 7 20.5 H9 M3.5 11 H7.5" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    ),
  },
};

// Cursor walks a mouse pointer through `path` in frame coordinates, gliding `travel` frames into each stop.
export const Cursor: React.FC<{ path: CursorStop[]; travel?: number }> = ({ path, travel = 18 }) => {
  const frame = useCurrentFrame();
  if (path.length === 0 || frame < path[0].at) return null;
  const next = path.findIndex((stop) => stop.at > frame);
  const reached = next === -1 ? path.length - 1 : next - 1;
  const from = path[reached];
  const to = next === -1 ? from : path[next];
  const t =
    to === from
      ? 1
      : interpolate(frame, [Math.max(from.at, to.at - travel), to.at], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const shape = CURSOR_SHAPES[from.shape ?? "arrow"];
  const lastClick = [...path.slice(0, reached + 1)].reverse().find((stop) => stop.click);
  const sinceClick = lastClick ? frame - lastClick.at : Infinity;
  const press = interpolate(sinceClick, [0, 3, 8], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(sinceClick, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 100 }}>
      {sinceClick < 12 ? (
        <div
          style={{
            position: "absolute",
            left: -24 - ring * 16,
            top: -24 - ring * 16,
            width: 48 + ring * 32,
            height: 48 + ring * 32,
            borderRadius: 999,
            border: `3px solid ${theme.accent}`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: -shape.hotspot.x,
          top: -shape.hotspot.y,
          transform: `scale(${press})`,
          transformOrigin: `${shape.hotspot.x}px ${shape.hotspot.y}px`,
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))",
        }}>
        {shape.svg}
      </div>
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; tone?: "accent" | "warn" | "plain"; style?: React.CSSProperties }> = ({
  children,
  tone = "plain",
  style,
}) => {
  const palette =
    tone === "accent"
      ? { bg: theme.accentSoft, fg: theme.accent }
      : tone === "warn"
        ? { bg: theme.warnSoft, fg: theme.warn }
        : { bg: theme.panelRaised, fg: theme.muted };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 18px",
        borderRadius: 999,
        background: palette.bg,
        color: palette.fg,
        fontFamily: theme.sans,
        fontWeight: 600,
        fontSize: 26,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Arrow draws a horizontal arrow that grows from left to right (or right to left when reversed).
export const Arrow: React.FC<{
  at: number;
  x1: number;
  x2: number;
  y: number;
  label?: React.ReactNode;
  color?: string;
  duration?: number;
}> = ({ at, x1, x2, y, label, color = theme.fg, duration = 14 }) => {
  const t = useAppear(at, duration);
  const labelOpacity = useAppear(at + 6, 10);
  const reversed = x2 < x1;
  const length = Math.abs(x2 - x1);
  const drawn = length * t;
  const left = reversed ? x1 - drawn : x1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left, top: y - 2, width: drawn, height: 4, background: color, borderRadius: 2 }} />
      <div
        style={{
          position: "absolute",
          left: reversed ? x1 - drawn - 2 : x1 + drawn - 20,
          top: y - 12,
          width: 0,
          height: 0,
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          [reversed ? "borderRight" : "borderLeft"]: `22px solid ${color}`,
          opacity: t > 0.05 ? 1 : 0,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: Math.min(x1, x2),
            width: length,
            top: y - 58,
            textAlign: "center",
            opacity: labelOpacity,
            color,
            fontFamily: theme.mono,
            fontSize: 26,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <Img src={logo} style={{ display: "block", width: size, height: size, borderRadius: 999, background: "#fff" }} />
);

const TitleCard: React.FC<{ eyebrow: string; title: string }> = ({ eyebrow, title }) => {
  const t = useAppear(0, 15);
  return (
    <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center", fontFamily: theme.sans }}>
      <div style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Logo size={96} />
        <div style={{ color: theme.accent, fontSize: 30, fontWeight: 600, letterSpacing: 4, marginTop: 28 }}>{eyebrow}</div>
        <div style={{ color: theme.fg, fontSize: 76, fontWeight: 700, marginTop: 14 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ next: string }> = ({ next }) => {
  const t = useAppear(0, 15);
  return (
    <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center", fontFamily: theme.sans }}>
      <div style={{ opacity: t, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Logo size={80} />
          <span style={{ color: theme.fg, fontSize: 64, fontWeight: 700 }}>6022</span>
        </div>
        <span style={{ color: theme.fg, fontSize: 40, fontWeight: 600, marginTop: 36 }}>
          <span style={{ color: theme.accent }}>Next: </span>
          {next}
        </span>
        <span style={{ color: theme.muted, fontSize: 28, fontFamily: theme.mono }}>docs.agentic.6022.io</span>
      </div>
    </AbsoluteFill>
  );
};

// Branded frames every video: title card, the content, then the 6022 end card.
export const Branded: React.FC<{ eyebrow: string; title: string; next: string; contentFrames: number; children: React.ReactNode }> = ({
  eyebrow,
  title,
  next,
  contentFrames,
  children,
}) => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <Sequence durationInFrames={config.titleFrames}>
      <TitleCard eyebrow={eyebrow} title={title} />
    </Sequence>
    <Sequence from={config.titleFrames} durationInFrames={contentFrames}>
      {children}
    </Sequence>
    <Sequence from={config.titleFrames + contentFrames} durationInFrames={config.endFrames}>
      <EndCard next={next} />
    </Sequence>
  </AbsoluteFill>
);

export const brandedFrames = (contentFrames: number): number => config.titleFrames + contentFrames + config.endFrames;

// Poster is the thumbnail shown before a video plays: the pitch on the left, a frozen key frame on the right.
export const Poster: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  duration: string;
  narrated?: boolean;
  frame: number;
  children: React.ReactNode;
}> = ({ eyebrow, title, subtitle, duration, narrated, frame, children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 10% 0%, ${theme.accentGlow} 0%, ${theme.bg} 55%)`,
      fontFamily: theme.sans,
      flexDirection: "row",
      alignItems: "center",
      padding: "0 90px",
      gap: 70,
    }}
  >
    <div style={{ width: 640, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Logo size={64} />
        <span style={{ color: theme.accent, fontSize: 26, fontWeight: 600, letterSpacing: 4 }}>{eyebrow}</span>
      </div>
      <div style={{ color: theme.fg, fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 34 }}>{title}</div>
      <div style={{ color: theme.muted, fontSize: 32, lineHeight: 1.35, marginTop: 26 }}>{subtitle}</div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          marginTop: 40,
          padding: "10px 22px",
          borderRadius: 999,
          background: theme.accentSoft,
          color: theme.accent,
          fontSize: 26,
          fontWeight: 600,
        }}
      >
        ▶ {duration}
        {narrated ? " · 🔊" : null}
      </div>
    </div>
    <div
      style={{
        position: "relative",
        width: WIDTH / 2,
        height: HEIGHT / 2,
        flexShrink: 0,
        borderRadius: theme.radius,
        overflow: "hidden",
        border: `2px solid ${theme.border}`,
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.55)",
      }}
    >
      <div style={{ width: WIDTH, height: HEIGHT, transform: "scale(0.5)", transformOrigin: "top left" }}>
        <Freeze frame={frame}>{children}</Freeze>
      </div>
    </div>
  </AbsoluteFill>
);

type NarratedScene = { from: number; durationInFrames: number; audioAt: number; clip: string };

// Narrated plays one scene per spoken line, timed by voice/timeline.mjs so the voice never waits on the picture.
export const Narrated: React.FC<{ video: string; timeline: NarratedScene[]; scenes: React.ReactNode[] }> = ({ video, timeline, scenes }) => {
  if (scenes.length !== timeline.length) {
    throw new Error(`${video} has ${scenes.length} scenes for ${timeline.length} voice lines`);
  }
  return (
    <>
      {timeline.map((scene, i) => (
        <React.Fragment key={scene.from}>
          <Sequence from={scene.from} durationInFrames={scene.durationInFrames}>
            {scenes[i]}
          </Sequence>
          <Sequence from={scene.audioAt} durationInFrames={scene.from + scene.durationInFrames - scene.audioAt} layout="none">
            <Audio src={staticFile(`voice/${video}/${scene.clip}.mp3`)} />
          </Sequence>
        </React.Fragment>
      ))}
    </>
  );
};

export const narratedFrames = (timeline: NarratedScene[]): number => timeline.reduce((sum, scene) => sum + scene.durationInFrames, 0);
