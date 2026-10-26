// The narration script and where each line's clip lives, shared by generate.mjs and timeline.mjs.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const root = path.resolve(import.meta.dirname, "..");
export const config = JSON.parse(fs.readFileSync(path.join(root, "config.json"), "utf8"));
export const script = JSON.parse(fs.readFileSync(path.join(root, "voice/lines.json"), "utf8"));

export const voiceDir = (video) => path.join(root, "public/voice", video);

// Clips are named after what is spoken, so reordering or inserting lines never re-speaks the others.
export const clipName = (text) => crypto.createHash("sha256").update(`${script.voice}|${script.model}|${text}`).digest("hex").slice(0, 12);
