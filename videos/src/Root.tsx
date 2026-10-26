import React from "react";
import { Composition } from "remotion";
import "./style.css";
import lines from "../voice/lines.json";
import { Branded, FPS, HEIGHT, Poster, WIDTH, brandedFrames } from "./kit";
import { PROTOCOL_FLOW_DURATION, ProtocolFlow } from "./ProtocolFlow";
import { X402_EXCHANGE_DURATION, X402Exchange } from "./X402Exchange";
import { AGENT_NODE_CONSOLE_DURATION, AgentNodeConsole } from "./AgentNodeConsole";
import { TEAM_CONVERSATION_DURATION, TeamConversation } from "./TeamConversation";

type Video = {
  id: string;
  eyebrow: string;
  title: string;
  next: string;
  subtitle: string;
  contentFrames: number;
  posterFrame: number;
  component: React.FC;
};

// Ids are the file names rendered into ../static/video; each video also gets a "poster-<id>" still as its thumbnail.
const VIDEOS: Video[] = [
  {
    id: "protocol-flow",
    eyebrow: "THE 6022 PROTOCOL",
    title: "How one agent calls another",
    next: "the quickstart",
    subtitle: "Find it by name, check who it is, ask, and pay only for an answer.",
    contentFrames: PROTOCOL_FLOW_DURATION,
    posterFrame: 420,
    component: ProtocolFlow,
  },
  {
    id: "x402-exchange",
    eyebrow: "PAYMENTS",
    title: "One paid call",
    next: "set a price for your agent",
    subtitle: "The price, the signature, the answer, and only then the payment.",
    contentFrames: X402_EXCHANGE_DURATION,
    posterFrame: 490,
    component: X402Exchange,
  },
  {
    id: "team-slack",
    eyebrow: "6022 TEAMS",
    title: "A support team in Slack",
    next: "set up your first team",
    subtitle: "Four agents sort out a late delivery, and the experts call each other.",
    contentFrames: TEAM_CONVERSATION_DURATION,
    posterFrame: 800,
    component: () => <TeamConversation skin="slack" />,
  },
  {
    id: "team-microsoft-teams",
    eyebrow: "6022 TEAMS · COMING SOON",
    title: "A team in Microsoft Teams",
    next: "start with Slack today",
    subtitle: "A preview: five agents plan an office party.",
    contentFrames: TEAM_CONVERSATION_DURATION,
    posterFrame: 800,
    component: () => <TeamConversation skin="teams" />,
  },
  {
    id: "agent-node-console",
    eyebrow: "6022 AGENT",
    title: "From zero to a first answer",
    next: "run it yourself with the quickstart",
    subtitle: "Mint an identity, pick a model, and talk to your agent.",
    contentFrames: AGENT_NODE_CONSOLE_DURATION,
    posterFrame: 720,
    component: AgentNodeConsole,
  },
];

const duration = (contentFrames: number): string => {
  const seconds = Math.round(brandedFrames(contentFrames) / FPS);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const compositions = VIDEOS.map(({ id, eyebrow, title, next, subtitle, contentFrames, posterFrame, component: Content }) => {
  if (posterFrame >= contentFrames) {
    throw new Error(`${id}: poster frame ${posterFrame} is past the content's ${contentFrames} frames`);
  }
  const Video: React.FC = () => (
    <Branded eyebrow={eyebrow} title={title} next={next} contentFrames={contentFrames}>
      <Content />
    </Branded>
  );
  const Still: React.FC = () => (
    <Poster eyebrow={eyebrow} title={title} subtitle={subtitle} duration={duration(contentFrames)} narrated={id in lines.videos} frame={posterFrame}>
      <Content />
    </Poster>
  );
  return { id, contentFrames, Video, Still };
});

export const RemotionRoot: React.FC = () => (
  <>
    {compositions.map(({ id, contentFrames, Video }) => (
      <Composition key={id} id={id} component={Video} durationInFrames={brandedFrames(contentFrames)} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
    {/* As long as the content, so the frozen snapshot's sequences aren't clipped; render frame 0 only. */}
    {compositions.map(({ id, contentFrames, Still }) => (
      <Composition key={id} id={`poster-${id}`} component={Still} durationInFrames={contentFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
  </>
);
