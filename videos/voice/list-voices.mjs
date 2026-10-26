// Lists the ElevenLabs voices available to your key: npm run voices
import fs from "node:fs";
import path from "node:path";

const envFile = path.resolve(import.meta.dirname, "../.env");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
if (!process.env.ELEVENLABS_API_KEY) {
  console.error("Put ELEVENLABS_API_KEY in videos/.env (see .env.example).");
  process.exit(1);
}
const res = await fetch("https://api.elevenlabs.io/v2/voices?page_size=100", {
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
});
if (!res.ok) {
  console.error(`ElevenLabs answered ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { voices } = await res.json();
for (const voice of voices) {
  const labels = voice.labels ?? {};
  console.log(
    [voice.voice_id, voice.name, labels.gender, labels.accent, labels.age, labels.use_case ?? labels["use case"], labels.description ?? labels.descriptive]
      .filter(Boolean)
      .join(" | "),
  );
}
