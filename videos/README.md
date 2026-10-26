# Documentation videos

[Remotion](https://www.remotion.dev) sources of the videos embedded in the docs. Renders are committed to `../static/video` (`<id>.mp4` plus a `<id>.jpg` poster, and a `<id>.vtt` for narrated videos) and embedded with `<Video name="<id>" caption="…" />` in any `.md`/`.mdx` page.

| Composition | Used on |
| --- | --- |
| `protocol-flow` | Introduction |
| `x402-exchange` | Concepts › Payments |
| `agent-node-console` | Quickstart |
| `team-slack` | Teams › Overview |
| `team-microsoft-teams` | Teams › Overview (coming soon) |

`agent-node-console` imports real components from the 6022 Agent console, so any full render needs
[`agentic-agent-node`](https://github.com/6022-labs/agentic-agent-node) checked out next to this repository with
its web dependencies installed (`cd ../agentic-agent-node/web && npm ci`). `clsx` and `tailwind-merge` are
dependencies here only for those components (their `cn()` helper). Run the scripts from this folder, with Node 20.12 or later.

```bash
npm ci
npm run studio                  # preview and edit in the browser
npm run render                  # render every video
npm run render -- x402-exchange # render one (unknown ids fail)
```

Every video is one row of the `VIDEOS` table in `src/Root.tsx` (titles, end card, poster text and frame), which
builds both the video and its `poster-<id>` composition; `render.mjs` reads the ids from Remotion.
`src/kit.tsx` holds what videos share: the title and end cards, the brand tokens, the poster and a few animation
helpers. Frame rate and title/end card lengths live in `config.json`. Videos that imitate other apps (Slack,
Microsoft Teams) keep those apps' look inside the frame.

## Narration

`protocol-flow` is narrated by an [ElevenLabs](https://elevenlabs.io) voice. `voice/lines.json` holds the voice,
the model, and each scene's line and minimum length (`minFrames`), plus the breath before and after each line
(`leadFrames`, `tailFrames`).

Only speaking needs a key and spends credits. Everything else is offline:

- **Text or voice changed**: put your key in `.env` (see `.env.example`), then `npm run voice -- protocol-flow`.
  It speaks only lines without a clip, and deletes clips no line uses. Clips are named after a hash of voice,
  model and text, so reordering lines never re-speaks them. `npm run voices` lists the voices your key can use.
- **Timing changed** (`minFrames`, `leadFrames`, `tailFrames`): nothing to speak. `npm run timeline`, which
  `npm run render` also runs first, rebuilds `public/voice/<id>/timeline.json` and the `../static/video/<id>.vtt`
  subtitles from the clips, and fails with "line N changed" when a line has no matching clip.

The voice sets the pace: each scene lasts as long as its line plus a short breath, so there is no dead air.
Commit `voice/lines.json`, everything in `public/voice/<id>/` (the clips' `.mp3` and `.json`, and
`timeline.json`) and the renders in `../static/video`; rendering never calls ElevenLabs.

Keep videos few and short: one per concept that is easier to watch than to read. Remotion is free for
individuals and companies of up to three people; larger organisations need a
[company license](https://www.remotion.pro/license).
