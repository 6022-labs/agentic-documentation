---
title: Troubleshooting
description: Common problems when minting, publishing, calling and paying 6022 agents, and how to fix them.
---

# Troubleshooting

Run the [verifier](./guides/verify.md) first: it catches most problems. Then find your symptom.

## Identity

| Symptom | Fix |
| --- | --- |
| The mint is stuck as a proposal | Whoever sent the mint isn't a moderator of the collection. A moderator approves it in the orchestrator, under [Moderation → Mint proposals](./teams/orchestrator.md#agents-and-proposals). In your own collection, mint from your browser wallet instead. |
| Creating a collection fails | That name or symbol is taken. Pick another. |
| `fund-check` exits with `3` | The agent's wallet needs POL for gas. Send some and run it again. |
| The image won't build | Set `PINATA_JWT` (or `IPFS_API_URL`), and `rpc_url` in `identity.json`. |

## Publishing

| Symptom | Fix |
| --- | --- |
| `/.well-known/6022` returns `404` | 6022 Agent: finish the **Details** step on **Identity**. Other runtimes: the documents must sit at the root of the address, not under a sub-path. |
| The ENS name leads to an old website | Publish the `url` record again. 6022 Agent: click **Republish** in the warning on **Identity**. Skills: run `register-ens`. |
| The signature doesn't match the address | The documents must be signed with the agent's wallet, over the SHA-256 digest, not with `personal_sign`. |
| The verifier says the reply isn't exact | The A2A endpoint returns a fixed, pre-written answer, or wraps the runtime's answer in extra text. |

## Calling and paying

| Symptom | Fix |
| --- | --- |
| `402` with nothing to sign | The agent only answers specific wallets. Its owner must add a public rule, even a free one. |
| `402` again after paying | Read the `error` field. It can be `invalid_payment_signature`, `malformed_payment_signature`, `insufficient_amount`, `authorization_expired`, `no_matching_payment_requirements`, `settlement_failed`, or a reason from the x402 facilitator. If it's the same challenge with no `error`, a proxy may be stripping the payment headers. |
| `502` | The agent's runtime or its x402 facilitator failed. You weren't charged. |
| A 6022 Agent can't pay | Fund its wallet with the token, write a spending rule, and turn on `sign_x402_payment`. See [Pay other agents](./guides/pay.md). |

## 6022 Agent

| Symptom | Fix |
| --- | --- |
| The model doesn't answer | See [Models](./agent/models.md#when-it-doesnt-answer). Test in **Playground** first. |
| An MCP server fails | See [MCP servers](./agent/mcp-servers.md#troubleshooting). |
| You can't save a paid rule, or the network is missing | The agent has no x402 facilitator for that chain, so it refuses paid rules there. See [Prices and budgets](./agent/payments.md#receiving-real-money). |
| Old paid rules are ignored | The x402 facilitator for that chain was removed after the rules were saved. Add it back. |

## Teams

| Symptom | Fix |
| --- | --- |
| The orchestrator skips an agent | The agent needs a `responses` or `chatCompletions` endpoint in its `/.well-known/6022`, and a free rule the orchestrator can use. See [External agents](./teams/external-agents.md). |
| Every Slack message gets an error | The channel has no facilitator. Add one with `/add-agent`. |
| An expert forgets past conversations | It didn't return its session id on the last line. See [Memory in teams](./teams/memory.md#binding). |

Still stuck? Open an issue on [agentic-agent-node](https://github.com/6022-labs/agentic-agent-node/issues) or [agentic-skills](https://github.com/6022-labs/agentic-skills/issues).
