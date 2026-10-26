import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Bell,
  Bold,
  Bookmark,
  Calendar,
  ChevronDown,
  Cloud,
  Hash,
  Home,
  Info,
  Italic,
  LayoutGrid,
  Link,
  List,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Reply,
  Search,
  SendHorizontal,
  Smile,
  Users,
  Video,
  X,
} from "lucide-react";
import { loadFont as loadLato } from "@remotion/google-fonts/Lato";
import { Pill, PopIn, theme, useAppear, usePop } from "./kit";

const lato = loadLato("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });

type Skin = "slack" | "teams";

type Author = { name: string; kind: "human" | "agent"; color: string; initials: string };

type Message = { at: number; kind: "message"; author: Author; text: string; time: string };
type Event = { at: number; kind: "event"; text: string };
type Step = Message | Event;

// Slack: a late delivery. An agent wakes when a message names it, so each answer opens with the asker's name.
const MARIE: Author = { name: "Marie", kind: "human", color: theme.human, initials: "M" };
const SUPPORT: Author = { name: "support", kind: "agent", color: theme.accentLight, initials: "S" };
const ORDERS: Author = { name: "orders", kind: "agent", color: theme.agent2, initials: "O" };
const SHIPPING: Author = { name: "shipping", kind: "agent", color: "#8e44ad", initials: "Sh" };
const REFUNDS: Author = { name: "refunds", kind: "agent", color: "#c0392b", initials: "R" };

const SLACK_SCRIPT: Step[] = [
  { at: 20, kind: "message", author: MARIE, text: "Hi, order #8812 was due Monday and it still hasn't arrived.", time: "10:42 AM" },
  { at: 75, kind: "event", text: "The facilitator takes the thread" },
  {
    at: 110,
    kind: "message",
    author: SUPPORT,
    text: "Thanks Marie. orders.acme.137.6022.eth, what's the status of order #8812?",
    time: "10:42 AM",
  },
  {
    at: 210,
    kind: "message",
    author: ORDERS,
    text: "Paid and shipped Friday, tracking DX-4471. shipping.acme.137.6022.eth, where is DX-4471 now?",
    time: "10:42 AM",
  },
  { at: 300, kind: "event", text: "Orders calls Shipping itself" },
  {
    at: 340,
    kind: "message",
    author: SHIPPING,
    text: "orders.acme.137.6022.eth, a storm is holding DX-4471 at the Lyon hub. New delivery date: Thursday.",
    time: "10:43 AM",
  },
  {
    at: 450,
    kind: "message",
    author: ORDERS,
    text: "It's 3 days late. refunds.acme.137.6022.eth, is order #8812 eligible for a late-delivery credit?",
    time: "10:43 AM",
  },
  {
    at: 550,
    kind: "message",
    author: REFUNDS,
    text: "orders.acme.137.6022.eth, yes: a €5 credit is now on Marie's account.",
    time: "10:43 AM",
  },
  { at: 640, kind: "message", author: SUPPORT, text: "All set. :end:", time: "10:44 AM" },
  { at: 680, kind: "event", text: ":end: closes the discussion, so the facilitator writes the answer" },
  {
    at: 730,
    kind: "message",
    author: SUPPORT,
    text: "Marie, a storm held your parcel in Lyon. It arrives Thursday, and we've added a €5 credit to your account.",
    time: "10:44 AM",
  },
  { at: 830, kind: "event", text: "The thread is closed. Posting again reopens it." },
];

// Microsoft Teams: an office party, to show the same team works for any conversation.
const TOM: Author = { name: "Tom", kind: "human", color: theme.human, initials: "T" };
const OFFICE: Author = { name: "office", kind: "agent", color: theme.accentLight, initials: "Of" };
const CALENDAR: Author = { name: "calendar", kind: "agent", color: theme.agent2, initials: "C" };
const VENUE: Author = { name: "venue", kind: "agent", color: "#8e44ad", initials: "V" };
const CATERING: Author = { name: "catering", kind: "agent", color: "#c0392b", initials: "Ca" };
const BUDGET: Author = { name: "budget", kind: "agent", color: "#2e86c1", initials: "B" };

const TEAMS_SCRIPT: Step[] = [
  {
    at: 20,
    kind: "message",
    author: TOM,
    text: "Can we plan a summer party for the team? 30 people, sometime in June.",
    time: "9:15 AM",
  },
  { at: 75, kind: "event", text: "The facilitator takes the post" },
  {
    at: 110,
    kind: "message",
    author: OFFICE,
    text: "Sure Tom. calendar.globex.137.6022.eth, which Friday in June suits most of the 30?",
    time: "9:15 AM",
  },
  {
    at: 200,
    kind: "message",
    author: CALENDAR,
    text: "June 20: 27 people are free. venue.globex.137.6022.eth, is the rooftop free that evening?",
    time: "9:15 AM",
  },
  {
    at: 290,
    kind: "message",
    author: VENUE,
    text: "calendar.globex.137.6022.eth, yes: the rooftop is booked for June 20, 6 to 10 pm.",
    time: "9:16 AM",
  },
  { at: 370, kind: "event", text: "Calendar asked Venue directly" },
  {
    at: 410,
    kind: "message",
    author: OFFICE,
    text: "catering.globex.137.6022.eth, food and drinks for 30 on the rooftop, June 20?",
    time: "9:16 AM",
  },
  {
    at: 500,
    kind: "message",
    author: CATERING,
    text: "A buffet at €25 each, €750 in total. budget.globex.137.6022.eth, can we spend €750?",
    time: "9:16 AM",
  },
  {
    at: 590,
    kind: "message",
    author: BUDGET,
    text: "catering.globex.137.6022.eth, approved. €1,200 is left in the team budget.",
    time: "9:17 AM",
  },
  { at: 680, kind: "message", author: OFFICE, text: "Everything is booked. :end:", time: "9:17 AM" },
  {
    at: 730,
    kind: "message",
    author: OFFICE,
    text: "Tom: Friday June 20, 6 pm on the rooftop, with a buffet for 30 (€750, approved).",
    time: "9:17 AM",
  },
  { at: 830, kind: "event", text: "The post is closed. Replying again reopens it." },
];

export const TEAM_CONVERSATION_DURATION = 930;

const SCRIPTS: Record<Skin, Step[]> = { slack: SLACK_SCRIPT, teams: TEAMS_SCRIPT };

// The agents that already replied, in order of first reply, for Slack's "N replies" row.
const repliersAt = (replies: Step[], frame: number): Author[] =>
  replies
    .filter((step): step is Message => step.kind === "message" && frame >= step.at)
    .map((step) => step.author)
    .filter((author, index, all) => all.findIndex((a) => a.name === author.name) === index);

// Only steps that already happened take space, so the list grows from the bottom like a real chat.
const useVisible = (at: number): boolean => useCurrentFrame() >= at;

// Rich text: agents name each other by plain ENS name, and :end: is shown as code in each app's own style.
const RichText: React.FC<{ text: string; code: React.CSSProperties }> = ({ text, code }) => (
  <>
    {text.split(/(:end:)/).map((part, i) =>
      part === ":end:" ? (
        <code key={i} style={{ display: "inline", whiteSpace: "nowrap", ...code }}>
          {part}
        </code>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

const Avatar: React.FC<{ author: Author; size: number; radius: number }> = ({ author, size, radius }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: radius,
      background: author.color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: size * 0.45,
    }}>
    {author.initials}
  </div>
);

const TodayDivider: React.FC<{ line: string; style: React.CSSProperties; label: React.CSSProperties }> = ({ line, style, label }) => (
  <div style={{ display: "flex", alignItems: "center", ...style }}>
    <div style={{ flex: 1, height: 1, background: line }} />
    <span style={label}>Today</span>
    <div style={{ flex: 1, height: 1, background: line }} />
  </div>
);

// ---------- Slack: the channel in the middle, the conversation in the thread pane on the right ----------

const SLACK = {
  top: "#350d36",
  sidebar: "#4a154b",
  sidebarText: "#e8dce8",
  text: "#1d1c1d",
  muted: "#616061",
  border: "#dddddd",
  link: "#1264a3",
};

const SlackMessage: React.FC<{ step: Message; compact?: boolean }> = ({ step, compact }) => {
  const s = usePop(step.at);
  if (!useVisible(step.at)) {
    return null;
  }
  return (
    <div style={{ display: "flex", gap: 16, padding: compact ? "10px 22px" : "12px 28px", opacity: s }}>
      <Avatar author={step.author} size={48} radius={8} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 26, color: SLACK.text }}>{step.author.name}</span>
          {step.author.kind === "agent" ? (
            <span style={{ fontSize: 15, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(29,28,29,0.08)", color: SLACK.muted }}>
              APP
            </span>
          ) : null}
          <span style={{ fontSize: 19, color: SLACK.muted }}>{step.time}</span>
        </div>
        <div style={{ fontSize: 27, lineHeight: 1.4, color: SLACK.text, marginTop: 2 }}>
          <RichText
            text={step.text}
            code={{ fontFamily: theme.mono, fontSize: "0.85em", color: "#e01e5a", background: "rgba(29,28,29,0.04)", border: "1px solid rgba(29,28,29,0.13)", borderRadius: 4, padding: "0 4px" }}
          />
        </div>
      </div>
    </div>
  );
};

const SlackEvent: React.FC<{ step: Event }> = ({ step }) => {
  const t = useAppear(step.at, 10);
  if (!useVisible(step.at)) {
    return null;
  }
  return <div style={{ opacity: t, padding: "6px 28px 6px 92px", fontSize: 24, fontStyle: "italic", color: SLACK.muted }}>{step.text}</div>;
};

const SlackComposer: React.FC<{ placeholder: string; margin: string }> = ({ placeholder, margin }) => (
  <div style={{ margin, border: `1px solid ${SLACK.border}`, borderRadius: 10, color: SLACK.muted }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 14px", background: "#f8f8f8", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <Bold size={18} />
      <Italic size={18} />
      <Link size={18} />
      <List size={18} />
    </div>
    <div style={{ fontSize: 20, padding: "12px 14px 6px" }}>{placeholder}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 14px 10px" }}>
      <Plus size={20} />
      <Smile size={20} />
      <AtSign size={20} />
      <SendHorizontal size={20} style={{ marginLeft: "auto" }} />
    </div>
  </div>
);

const SlackRailItem: React.FC<{ icon: React.FC<{ size?: number; color?: string }>; label: string; active?: boolean }> = ({ icon: Icon, label, active }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 18 }}>
    <div style={{ width: 48, height: 48, borderRadius: 10, background: active ? "rgba(255,255,255,0.22)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={26} color="#ffffff" />
    </div>
    <span style={{ fontSize: 14, color: "#ffffff", fontWeight: 600 }}>{label}</span>
  </div>
);

const SlackView: React.FC = () => {
  const parent = SCRIPTS.slack[0] as Message;
  const replySteps = SCRIPTS.slack.slice(1);
  const frame = useCurrentFrame();
  const replies = replySteps.filter((step) => step.kind === "message" && frame >= step.at).length;
  const repliesLabel = `${replies} ${replies === 1 ? "reply" : "replies"}`;
  return (
    <AbsoluteFill style={{ fontFamily: lato.fontFamily, background: SLACK.top }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 720, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", color: "#ffffff", fontSize: 18 }}>
          <Search size={18} /> Search Acme
        </div>
      </div>
      <div style={{ display: "flex", height: 1024 }}>
        <div style={{ width: 84, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "#ffffff", color: SLACK.top, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
            A
          </div>
          <SlackRailItem icon={Home} label="Home" active />
          <SlackRailItem icon={MessageSquare} label="DMs" />
          <SlackRailItem icon={Bell} label="Activity" />
          <SlackRailItem icon={Bookmark} label="Later" />
          <SlackRailItem icon={MoreHorizontal} label="More" />
        </div>
        <div style={{ width: 290, background: SLACK.sidebar, color: SLACK.sidebarText, padding: "18px 12px", borderTopLeftRadius: 10, fontSize: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontWeight: 800, fontSize: 26, padding: "0 10px 18px" }}>
            Acme <ChevronDown size={20} />
          </div>
          <div style={{ padding: "0 10px 8px", opacity: 0.8 }}>Channels</div>
          {[
            { name: "general", icon: Hash },
            { name: "ai-support", icon: Hash },
            { name: "billing-ops", icon: Lock },
          ].map(({ name, icon: Icon }) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: name === "ai-support" ? "rgba(255,255,255,0.9)" : "transparent",
                color: name === "ai-support" ? SLACK.top : SLACK.sidebarText,
                fontWeight: name === "ai-support" ? 700 : 400,
              }}>
              <Icon size={18} />
              {name}
            </div>
          ))}
        </div>
        <div style={{ width: 560, background: "#ffffff", display: "flex", flexDirection: "column", borderRight: `1px solid ${SLACK.border}` }}>
          <div style={{ padding: "14px 22px 0", borderBottom: `1px solid ${SLACK.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 26, fontWeight: 800, color: SLACK.text }}>
              <Hash size={24} /> ai-support <ChevronDown size={20} />
            </div>
            <div style={{ display: "flex", gap: 26, fontSize: 19, color: SLACK.muted, marginTop: 12 }}>
              <span style={{ color: SLACK.text, fontWeight: 700, borderBottom: `3px solid ${SLACK.top}`, paddingBottom: 8 }}>Messages</span>
              <span>Files</span>
              <Plus size={18} />
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 18 }}>
            <TodayDivider
              line={SLACK.border}
              style={{ margin: "0 22px 6px" }}
              label={{ fontSize: 16, fontWeight: 700, color: SLACK.text, border: `1px solid ${SLACK.border}`, borderRadius: 999, padding: "3px 14px" }}
            />
            <SlackMessage step={parent} compact />
            {replies > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 22px 0 86px", fontSize: 19, color: SLACK.link, fontWeight: 700 }}>
                {repliersAt(replySteps, frame).slice(0, 3).map((author) => (
                  <Avatar key={author.name} author={author} size={26} radius={8} />
                ))}
                {repliesLabel} <span style={{ color: SLACK.muted, fontWeight: 400 }}>Last reply today</span>
              </div>
            ) : null}
            <SlackComposer placeholder="Message #ai-support" margin="18px 22px 0" />
          </div>
        </div>
        <div style={{ flex: 1, background: "#ffffff", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 66, display: "flex", alignItems: "center", gap: 12, padding: "0 28px", borderBottom: `1px solid ${SLACK.border}` }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: SLACK.text }}>Thread</span>
            <span style={{ fontSize: 20, color: SLACK.muted }}># ai-support</span>
            <X size={24} color={SLACK.muted} style={{ marginLeft: "auto" }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", paddingBottom: 10 }}>
            <SlackMessage step={parent} />
            {replies > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 28px", color: SLACK.muted, fontSize: 19 }}>
                <span>{repliesLabel}</span>
                <div style={{ flex: 1, height: 1, background: SLACK.border }} />
              </div>
            ) : null}
            {replySteps.map((step) => (step.kind === "message" ? <SlackMessage key={step.at} step={step} /> : <SlackEvent key={step.at} step={step} />))}
          </div>
          <SlackComposer placeholder="Reply…" margin="0 28px 22px" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Microsoft Teams: channel posts, the conversation as one post with nested replies ----------

const TEAMS = {
  purple: "#5b5fc7",
  bar: "#ebebf2",
  rail: "#ebebeb",
  pane: "#f5f5f5",
  canvas: "#fafafa",
  text: "#242424",
  muted: "#616161",
  border: "#e0e0e0",
};

const TeamsRailItem: React.FC<{ icon: React.FC<{ size?: number; color?: string }>; label: string; active?: boolean }> = ({ icon: Icon, label, active }) => (
  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 0", width: "100%" }}>
    {active ? <div style={{ position: "absolute", left: 0, top: 16, bottom: 16, width: 4, borderRadius: 4, background: TEAMS.purple }} /> : null}
    <Icon size={30} color={active ? TEAMS.purple : TEAMS.muted} />
    <span style={{ fontSize: 16, color: active ? TEAMS.purple : TEAMS.muted, fontWeight: active ? 700 : 500 }}>{label}</span>
  </div>
);

const TeamsLine: React.FC<{ step: Message; first: boolean }> = ({ step, first }) => {
  const s = usePop(step.at);
  if (!useVisible(step.at)) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: first ? "20px 26px 16px" : "12px 26px 12px 44px",
        borderTop: first ? "none" : `1px solid ${TEAMS.border}`,
        background: first ? "#ffffff" : "#fcfcfc",
        opacity: s,
      }}>
      {/* Teams draws bots and apps with a rounded-square avatar, people with a circle. */}
      <Avatar author={step.author} size={first ? 48 : 40} radius={step.author.kind === "agent" ? 8 : 999} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 24, color: TEAMS.text }}>{step.author.name}</span>
          <span style={{ fontSize: 18, color: TEAMS.muted }}>{step.time}</span>
        </div>
        <div style={{ fontSize: 27, lineHeight: 1.4, color: TEAMS.text, marginTop: 4 }}>
          <RichText
            text={step.text}
            code={{ fontFamily: theme.mono, fontSize: "0.85em", background: "#f0f0f0", borderRadius: 4, padding: "0 5px" }}
          />
        </div>
      </div>
    </div>
  );
};

const TeamsEvent: React.FC<{ step: Event }> = ({ step }) => {
  const t = useAppear(step.at, 10);
  if (!useVisible(step.at)) {
    return null;
  }
  return (
    <div style={{ opacity: t, padding: "8px 26px 8px 100px", borderTop: `1px solid ${TEAMS.border}`, background: "#fcfcfc", fontSize: 22, fontStyle: "italic", color: TEAMS.muted }}>
      {step.text}
    </div>
  );
};

const TeamsView: React.FC = () => {
  const parent = SCRIPTS.teams[0] as Message;
  return (
  <AbsoluteFill style={{ background: TEAMS.canvas, fontFamily: `"Segoe UI", ${theme.sans}` }}>
    <div style={{ height: 56, background: TEAMS.bar, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: `1px solid ${TEAMS.border}` }}>
      <div style={{ position: "absolute", left: 110, display: "flex", gap: 18, color: TEAMS.muted }}>
        <ArrowLeft size={22} />
        <ArrowRight size={22} />
      </div>
      <div style={{ width: 620, height: 36, borderRadius: 6, background: "#ffffff", border: `1px solid ${TEAMS.border}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", color: TEAMS.muted, fontSize: 18 }}>
        <Search size={20} /> Search
      </div>
      <div style={{ position: "absolute", right: 24, display: "flex", alignItems: "center", gap: 18 }}>
        <MoreHorizontal size={22} color={TEAMS.muted} />
        <div style={{ width: 36, height: 36, borderRadius: 999, background: TEAMS.purple, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>GO</div>
      </div>
    </div>
    <div style={{ display: "flex", height: 1024 }}>
      <div style={{ width: 88, background: TEAMS.rail, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
        <TeamsRailItem icon={Bell} label="Activity" />
        <TeamsRailItem icon={MessageSquare} label="Chat" />
        <TeamsRailItem icon={Users} label="Teams" active />
        <TeamsRailItem icon={Calendar} label="Calendar" />
        <TeamsRailItem icon={Phone} label="Calls" />
        <TeamsRailItem icon={Cloud} label="OneDrive" />
        <TeamsRailItem icon={LayoutGrid} label="Apps" />
      </div>
      <div style={{ width: 300, background: TEAMS.pane, borderRight: `1px solid ${TEAMS.border}`, padding: "22px 16px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEAMS.text, marginBottom: 22 }}>Teams</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 19, fontWeight: 700, color: TEAMS.text, marginBottom: 10 }}>
          <ChevronDown size={18} />
          <div style={{ width: 30, height: 30, borderRadius: 6, background: "#4f52b2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>GO</div>
          Globex Office
        </div>
        {["General", "Office", "Events"].map((name) => (
          <div
            key={name}
            style={{
              padding: "9px 14px 9px 48px",
              borderRadius: 6,
              fontSize: 19,
              color: TEAMS.text,
              fontWeight: name === "Office" ? 700 : 400,
              background: name === "Office" ? "#ffffff" : "transparent",
              marginBottom: 2,
            }}>
            {name}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 66, background: "#ffffff", borderBottom: `1px solid ${TEAMS.border}`, display: "flex", alignItems: "center", gap: 24, padding: "0 30px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 6, background: "#4f52b2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>
            GO
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: TEAMS.text }}>Office</span>
          <span style={{ fontSize: 19, color: TEAMS.text, fontWeight: 600, borderBottom: `3px solid ${TEAMS.purple}`, padding: "20px 0 17px" }}>Posts</span>
          <span style={{ fontSize: 19, color: TEAMS.muted }}>Files</span>
          <span style={{ fontSize: 19, color: TEAMS.muted }}>+</span>
          <PopIn at={10} style={{ marginLeft: "auto", display: "flex" }}>
            <Pill tone="accent">Coming soon</Pill>
          </PopIn>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 6, border: `1px solid ${TEAMS.border}`, fontSize: 18, fontWeight: 600, color: TEAMS.text }}>
            <Video size={20} /> Meet <ChevronDown size={16} />
          </div>
          <Info size={22} color={TEAMS.muted} />
          <MoreHorizontal size={22} color={TEAMS.muted} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 36px", overflow: "hidden" }}>
          <TodayDivider line={TEAMS.border} style={{ gap: 14, marginBottom: 14 }} label={{ fontSize: 17, color: TEAMS.muted }} />
          <div style={{ background: "#ffffff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", overflow: "hidden", flexShrink: 0 }}>
            {SCRIPTS.teams.map((step) => (step.kind === "message" ? <TeamsLine key={step.at} step={step} first={step === parent} /> : <TeamsEvent key={step.at} step={step} />))}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 26px 12px 44px", borderTop: `1px solid ${TEAMS.border}`, color: TEAMS.purple, fontSize: 19, fontWeight: 600 }}>
              <Reply size={20} /> Reply
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 6, background: TEAMS.purple, color: "#fff", fontSize: 19, fontWeight: 600 }}>
              <MessageSquare size={20} /> Start a post
            </div>
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
  );
};

export const TeamConversation: React.FC<{ skin: Skin }> = ({ skin }) => (skin === "teams" ? <TeamsView /> : <SlackView />);
