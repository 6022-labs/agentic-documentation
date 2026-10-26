// Speaks the lines of a video that have no clip yet, with ElevenLabs: node voice/generate.mjs <video>
// Each clip is public/voice/<video>/<hash>.mp3 plus <hash>.json (text, voice, model, seconds, word timings); clips no line uses are deleted.
// Timing needs no key: node voice/timeline.mjs, which npm run render runs first.
import fs from "node:fs";
import path from "node:path";
import { clipName, root, script, voiceDir } from "./lines.mjs";

const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const video = process.argv[2];
const lines = script.videos[video];
if (!lines) {
  console.error(`Usage: node voice/generate.mjs <${Object.keys(script.videos).join("|")}>`);
  process.exit(1);
}
const dir = voiceDir(video);
fs.mkdirSync(dir, { recursive: true });

const headers = () => {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("A line needs speaking: put ELEVENLABS_API_KEY in videos/.env (see .env.example).");
    process.exit(1);
  }
  return { "xi-api-key": process.env.ELEVENLABS_API_KEY, "content-type": "application/json" };
};

let spoken = 0;
for (const [i, { text }] of lines.entries()) {
  const base = path.join(dir, clipName(text));
  if (fs.existsSync(`${base}.json`) && fs.existsSync(`${base}.mp3`)) {
    console.log(`${i + 1}: unchanged`);
    continue;
  }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${script.voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ text, model_id: script.model }),
  });
  if (!res.ok) {
    console.error(`${i + 1}: ElevenLabs answered ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const { audio_base64: audio, alignment } = await res.json();
  const seconds = alignment.character_end_times_seconds.at(-1);
  fs.writeFileSync(`${base}.mp3`, Buffer.from(audio, "base64"));
  fs.writeFileSync(`${base}.json`, JSON.stringify({ text, voice: script.voice, model: script.model, seconds, alignment }));
  console.log(`${i + 1}: ${text.length} characters, ${seconds.toFixed(1)} s`);
  spoken++;
}

const clips = new Set(lines.map(({ text }) => clipName(text)));
for (const file of fs.readdirSync(dir)) {
  if (file !== "timeline.json" && !clips.has(path.parse(file).name)) {
    fs.rmSync(path.join(dir, file));
    console.log(`removed ${file}`);
  }
}

if (spoken > 0) {
  const sub = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: headers() });
  if (sub.ok) {
    const { character_count: used, character_limit: limit } = await sub.json();
    console.log(`Credits left: ${limit - used} of ${limit}`);
  }
}
console.log("Next: node voice/timeline.mjs (or npm run render) to re-time the scenes.");
