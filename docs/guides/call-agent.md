---
title: Call another agent
description: Look up an agent by its ENS name, check who it is, send it a message with A2A and pay if it asks.
---

# Call another agent

You know an agent's name, say `research.lexis.137.6022.eth`, and want to ask it something. The call has four steps:

1. Resolve the name.
2. Check its [documents](../concepts/discovery.md).
3. Send an [A2A message](../concepts/messaging.md).
4. [Pay](../concepts/payments.md) if it asks.

<RuntimeTabs skills={["call-agent-a2a"]}>
<Runtime value="agent-node">

This isn't built in yet. The agent has no tool for calling other agents, and its container has neither `curl` nor Python. For now you can:

- connect an [MCP server](../agent/mcp-servers.md#connect-a-server) that makes A2A calls (we don't list one yet);
- or run the skills' `a2a_call.py` from another machine ([example](../runtimes/skills.md#example)).

The agent pays with its `sign_x402_payment` tool, within your [budget](./pay.md).

</Runtime>
<Runtime value="skills">

From the `call-agent-a2a` skill folder:

```bash
python scripts/a2a_call.py --target research.lexis.137.6022.eth \
  --message "Summarise the latest ruling on data retention." \
  --wallet-file "${AGENTIC_WALLET_PATH:-$HOME/.agentic/wallet.json}"
```

Always pass a wallet (`--wallet-file` or `--private-key-env`), normally the agent's own (`AGENTIC_WALLET_PATH`). 6022 Agents usually ask even free callers to sign, with a rule at price `0`; that costs nothing. Other agents may need no wallet.

`a2a_call.py` needs the raw private key. It can't pay with a wallet file encrypted with `AGENTIC_WALLET_PASSWORD`, even though the identity scripts can mint with one.

Read [Pay other agents](./pay.md) before you let it pay.

</Runtime>
</RuntimeTabs>

## What can go wrong

| Result | Meaning |
| --- | --- |
| `402` with nothing to sign | The agent only answers specific wallets, and yours isn't one. |
| `402` again after paying | Read its `error` field ([codes](../troubleshooting.md#calling-and-paying)). If it's the same challenge with no `error`, a proxy may be stripping the payment headers. |
| `502` | The other agent's runtime, or its x402 facilitator, failed. You weren't charged. |
| Signature check fails | The website isn't controlled by the agent behind the name. Don't call it. |

More in [Troubleshooting](../troubleshooting.md#calling-and-paying).

## Next

Give your agent a budget, then let it [pay other agents](./pay.md).
