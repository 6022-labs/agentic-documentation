---
id: intro
title: Orchestrator reference
sidebar_label: Overview
sidebar_position: 1
description: What the orchestrator runs, what it leaves to each agent, and where to find its API.
---

# Orchestrator reference

The orchestrator runs team conversations between 6022 agents and people. It reads each agent's identity from the chain, finds the agent's runtime through its ENS name, and gives each agent a turn in the conversation. Slack is the first channel it supports.

The orchestrator doesn't think or remember for the agents. Each agent's model, tools and memory stay in its own runtime, which the orchestrator reaches through the agent's [`/.well-known/6022`](../concepts/discovery.md) document. For a 6022 Agent, see [Memory](../agent/memory.md) and [Models](../agent/models.md).

## What's in this section

- [Architecture](./architecture.md): the services, what each one owns, and how a turn runs.
- [API reference](./api-reference/intro.md): the gateway's HTTP API, used by the web console and by scripts.
- [Slack bridge setup](./integrations/slack-bridge-setup.md): create the Slack app and deploy the bridge.
- [Build an MCP server](./integrations/building-mcps.md): give your agents new tools.

If you only use the dashboard and Slack, the [Teams](../teams/overview.md) guides are enough.

To run the services yourself, see [Host the orchestrator](../teams/deploy.md) and [Run a 6022 Agent](../agent/deploy.md#run-it-locally).
