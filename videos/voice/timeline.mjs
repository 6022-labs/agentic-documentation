// Times every narrated video from its spoken clips, offline: writes public/voice/<video>/timeline.json and ../static/video/<video>.vtt.
// The voice sets the pace: one scene per line, as long as the line plus a short breath, never shorter than minFrames.
import fs from "node:fs";
import path from "node:path";
import { clipName, config, root, script, voiceDir } from "./lines.mjs";

const { fps, titleFrames } = config;
const { leadFrames, tailFrames } = script;
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

const stamp = (seconds) => {
  const ms = Math.round(seconds * 1000);
  const pad = (n, size = 2) => String(n).padStart(size, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`;
};

for (const [video, lines] of Object.entries(script.videos)) {
  const scenes = [];
  const cues = [];
  let from = 0;
  for (const [i, line] of lines.entries()) {
    const clip = clipName(line.text);
    const file = path.join(voiceDir(video), `${clip}.json`);
    const spoken = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
    if (spoken?.text !== line.text || spoken?.voice !== script.voice || spoken?.model !== script.model) {
      throw new Error(`${video} line ${i + 1} changed: run node voice/generate.mjs ${video}`);
    }
    const durationInFrames = Math.max(line.minFrames, leadFrames + Math.ceil(spoken.seconds * fps) + tailFrames);
    scenes.push({ from, durationInFrames, audioAt: from + leadFrames, clip });
    const offset = (titleFrames + from + leadFrames) / fps;
    const { character_start_times_seconds: starts, character_end_times_seconds: ends } = spoken.alignment;
    // Each sentence cue spans its first to last character; segments carry their trailing spaces.
    for (const { segment, index } of segmenter.segment(spoken.text)) {
      const sentence = segment.trim();
      if (!sentence) continue;
      const first = index + segment.indexOf(sentence);
      cues.push({ start: offset + starts[first], end: offset + ends[first + sentence.length - 1], sentence });
    }
    from += durationInFrames;
  }
  // A short sentence would flash by, so each cue stays up to a second longer, until the next one starts.
  for (const [i, cue] of cues.entries()) {
    cue.end = Math.min(cue.end + 1, cues[i + 1]?.start ?? Infinity);
  }
  fs.writeFileSync(path.join(voiceDir(video), "timeline.json"), JSON.stringify(scenes, null, 2) + "\n");
  const body = cues.map((cue) => `${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.sentence}`).join("\n\n");
  fs.writeFileSync(path.join(root, "../static/video", `${video}.vtt`), `WEBVTT\n\n${body}\n`);
  console.log(`${video}: ${from} frames, ${cues.length} cues`);
}
