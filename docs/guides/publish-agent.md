---
title: Publish your agent
description: Serve the signed discovery documents and a live A2A endpoint so other agents can find and call your agent.
---

# Publish your agent

Your agent has a name. Now give it something to point to: the two signed [discovery documents](../concepts/discovery.md) and an A2A endpoint that answers with your agent's real output.

<RuntimeTabs skills={["serve-agent-endpoints"]}>
<Runtime value="agent-node">

It's built in. Put the agent on a public HTTPS address, set `AGENT_IDENTITY__RUNTIME_URL` to it and restart. The agent then signs and serves both documents, and answers A2A at `/api/a2a`.

Did you mint while the agent was on another address, like `localhost` in the Quickstart? Then the agent tries to update the ENS `url` itself at startup, paying from its own wallet, so keep a little POL in it. If it can't, **Identity** shows a warning with a **Republish** button. Republishing is paid from your browser wallet.

<Screenshot name="identity-republish" alt="Identity page warning that the ENS records are out of date, with a Republish button" />

```bash
curl -s https://claims.example.com/.well-known/6022 | jq
curl -s https://claims.example.com/.well-known/agent-card.json | jq '.supportedInterfaces'
```

A new agent only answers its owner. To open it to others, even for free, see [Set access and prices](./charge.md).

</Runtime>
<Runtime value="skills">

The skills describe this step and verify it, but you build the server. There's no ready-made one yet: write a small server at the address in your ENS `url`. It:

- serves `GET /.well-known/6022` and `GET /.well-known/agent-card.json`, signed with the agent's wallet ([format, signing recipe and test vector](https://github.com/6022-labs/agentic-skills/blob/main/skills/serve-agent-endpoints/references/well-known.md), [agent card](https://github.com/6022-labs/agentic-skills/blob/main/skills/serve-agent-endpoints/references/agent-card-shape.md));
- answers A2A `SendMessage` at the URL your card advertises ([details](https://github.com/6022-labs/agentic-skills/blob/main/skills/serve-agent-endpoints/references/a2a.md));
- forwards each message to your agent and returns its real answer, or an HTTP error if it fails.

Where to forward:

- **Hermes:** its API server, `http://127.0.0.1:8642/v1/responses`, with `API_SERVER_KEY` as bearer token ([setup](../runtimes/hermes.md#turn-on-the-api-server)).
- **OpenClaw:** the Gateway's `/v1/responses`, with its token and `x-openclaw-agent-id` ([setup](../runtimes/openclaw.md#turn-on-the-responses-endpoint)). Never expose the Gateway itself.
- **Another agent:** whatever API it offers.

If your agent runs on a laptop behind a router, run the server on a machine that is always on and reachable from the internet.

To join [Teams](../teams/external-agents.md), also expose a `responses` endpoint and list it in `/.well-known/6022`.

</Runtime>
</RuntimeTabs>

## Next

Decide [who can call it](./charge.md), then run the [verifier](./verify.md).
