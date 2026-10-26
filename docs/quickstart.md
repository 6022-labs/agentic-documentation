---
title: Quickstart
description: Run a 6022 Agent locally with Docker, give it an on-chain identity on a testnet, connect a model and talk to it.
---

# Quickstart

<TaskTime minutes={15} />

Run a 6022 Agent on your machine, give it an on-chain identity, and talk to it.

<Video name="agent-node-console" caption="What you'll do: start the agent, mint its identity, connect a model and ask it something." />

:::tip[Already run Hermes or OpenClaw?]
Keep your agent: set up [Hermes](./runtimes/hermes.md) or [OpenClaw](./runtimes/openclaw.md), then follow the Guides.
:::

You need Docker, a browser wallet such as MetaMask or Rabby, a little test POL on Amoy (from the [Polygon faucet](https://faucet.polygon.technology)), and an API key from a model provider such as Anthropic or OpenAI.

## 1. Start the agent

```bash
git clone https://github.com/6022-labs/agentic-agent-node
cd agentic-agent-node
docker compose up
```

The console is at [http://localhost:5500](http://localhost:5500). Compose also starts Vault, PostgreSQL, IPFS and Grafana.

## 2. Sign in

Connect your wallet and sign the message. It's free. Until you mint in step 3, anyone who can reach the console can sign in and claim the agent, so keep it on localhost.

## 3. Create the identity

Open **Identity** and follow the three steps:

1. **Details.**
   - Pick a [blockchain](./deployments.md). This guide uses the Amoy testnet.
   - Click **New** next to the collection list and create one:
     - Give it a short, unique name and symbol, such as `acme-yourname` and `ACMEY`. The name becomes part of every agent's name in it, for good.
     - If the transaction fails, the name is taken. Pick another.
     - You're its [moderator](./concepts/identity.md#collections), so your mint goes through right away.
   - Name the agent in lowercase, like `claims`, add an image and choose the role `expert`.

   <Screenshot name="wizard-new-collection" alt="Create collection dialog opened from the Details step" />

2. **Mint.** Choose **Browser wallet** to pay the gas yourself. The NFT is minted to you.
3. **ENS.** Publish the name. Your agent is now `claims.<collection>.80002.6022.eth`, pointing at `http://localhost:5500` for now. [Publish your agent](./guides/publish-agent.md) replaces it with a public address.

Minting into someone else's collection? It may wait for one of its [moderators](./concepts/identity.md#collections) to approve it. [Identity setup](./agent/identity.md) has the details.

## 4. Connect a model

Open **LLM**, pick a provider and a model, paste your API key and save. The key is stored in Vault and never shown again.

<Screenshot name="llm" alt="LLM page with an OpenAI connection saved" />

## 5. Talk to it

Open **Playground** and ask "Who are you?". It answers with the model you just connected, and knows its name from the identity you minted.

<Screenshot name="playground" alt="Playground answering Who are you?" />

The agent can also run shell commands inside its container: that tool is on by default. Turn it off in [Tools](./agent/tools.md) if you don't need it.

## Next steps

Right now only you can talk to it. To open it up:

- put it on a public HTTPS address ([Publish your agent](./guides/publish-agent.md));
- let others call it, for free or for a price ([Set access and prices](./guides/charge.md));
- check it from the outside ([Verify your agent](./guides/verify.md)).

To run it on a server instead of your laptop, see [Run it in production](./agent/deploy.md#run-it-in-production).
