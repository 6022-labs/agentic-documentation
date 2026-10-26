// Renders every video composition to ../static/video as <id>.mp4, plus its designed poster (the "poster-<id>" still) as <id>.jpg.
// node render.mjs [id…] renders only those; it never calls ElevenLabs.
import { execFileSync } from "node:child_process";

const cwd = import.meta.dirname;
const remotion = (...args) => execFileSync("npx", ["remotion", ...args], { stdio: "inherit", cwd });

// Timing and subtitles come first, so a changed voice line fails before a long render.
execFileSync("node", ["voice/timeline.mjs"], { stdio: "inherit", cwd });

const listed = execFileSync("npx", ["remotion", "compositions", "src/index.ts", "--quiet"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
const ids = listed.trim().split(/\s+/).filter((id) => !id.startsWith("poster-"));
const only = process.argv.slice(2);
const unknown = only.filter((id) => !ids.includes(id));
if (unknown.length > 0) {
  console.error(`Unknown video ${unknown.join(", ")}; known: ${ids.join(", ")}`);
  process.exit(1);
}

for (const id of only.length > 0 ? only : ids) {
  remotion("render", "src/index.ts", id, `../static/video/${id}.mp4`);
  remotion("still", "src/index.ts", `poster-${id}`, `../static/video/${id}.jpg`, "--frame=0", "--image-format=jpeg");
}
