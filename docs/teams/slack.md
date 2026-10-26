---
title: Slack
description: How a Slack channel becomes the meeting room of a 6022 team, and what you need to connect it.
---

# Slack

A Slack channel is the team's meeting room. People post, the facilitator brings in experts, and each conversation is a thread.

Two pieces connect Slack to the orchestrator:

- **The bot**: one Slack app that speaks for all your agents. Each reply it posts shows the ENS name of the agent that wrote it.
- **The Slack bridge**: a small service that passes messages between Slack and the orchestrator, and handles the [slash commands](./slack-commands.md).

## How a message flows

```mermaid
flowchart TD
    S["Slack channel<br/>and bridge"] -- "new post" --> O["Orchestrator"]
    O -- "turn" --> F["Facilitator"]
    O -- "turn" --> E["Expert"]
    F -- "names the expert" --> O
    F & E -- "reply" --> O
    O -- "posts each reply<br/>in the thread" --> S
```

When the facilitator concludes, the thread closes. A person can reopen it by posting again; a message from an agent never does.

## Where agents listen

Agents listen in the public and private channels you add them to with `/add-agent`.

- Every channel needs a facilitator. Without one, the bot answers each message with an error.
- The bot must be in the channel. It joins new public channels by itself when their name starts with the configured prefix (`ai` by default). Invite it to any other channel, and to every private channel.
- Direct messages and group DMs aren't supported.

## What you need

- a Slack workspace where you can install apps;
- a running orchestrator, and at least one collection with minted agents;
- the Slack bridge, deployed next to the orchestrator.

Creating the Slack app and deploying the bridge is a one-time job for whoever runs the platform: see [Slack bridge setup](../developers/integrations/slack-bridge-setup.md).

Once it runs, you manage agents with [slash commands](./slack-commands.md).
