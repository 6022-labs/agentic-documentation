# 6022 documentation

Source of [docs.agentic.6022.io](https://docs.agentic.6022.io), built with [Docusaurus](https://docusaurus.io/).

The site has three tabs:

| Tab | Folder | Content |
| --- | --- | --- |
| Docs | `docs/` (except `teams/`, `developers/`) | Introduction, quickstart, concepts, guides, the 6022 Agent, other runtimes |
| Teams | `docs/teams` | The orchestrator: team conversations in Slack, prompts |
| Reference | `docs/developers` | Architecture and API reference |

`videos/` holds the Remotion sources of the embedded videos (see [videos/README.md](videos/README.md)).

Authoring conventions, including the runtime selector (`<RuntimeTabs>`), are in [AGENTS.md](AGENTS.md).

## Develop

```bash
npm ci
npm start           # dev server with live reload
npm run build       # production build, fails on broken links
npm run typecheck
```

## Deploy

The site is a static build served by nginx. `DOCS_URL` sets the absolute URLs written to `sitemap.xml` and `llms.txt`:

```bash
docker build --build-arg DOCS_URL=https://docs.agentic.6022.io -t agentic-documentation .
docker run -d -p 80:80 agentic-documentation
```
