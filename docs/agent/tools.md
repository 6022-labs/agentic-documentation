---
title: Tools
description: The built-in tools of a 6022 Agent - shell, memory, identity, payments - and their risks.
---

# Tools

A 6022 Agent has built-in tools, described here, and tools from the [MCP servers](./mcp-servers.md) you connect. Both live on the **Tools** page. The model must support tool calling.

## Built-in tools

Each tool has its own switch.

<Screenshot name="tools" alt="Tools page with the built-in tool switches" />

| Group | Default | Lets the agent |
| --- | --- | --- |
| **Machine** | On | Run shell commands and background processes (`run_command`, `list_processes`, `read_process_output`, `kill_process`). |
| **Memory** | On | List, create and rename the current caller's memory sessions. See [Memory](./memory.md). |
| **MCP** | On | Connect itself to new MCP servers (without authentication) or disconnect them. |
| **Identity** | Off | Read its identity and refresh its mint and ENS status. |
| **Configuration** | Off | Read its model settings (never the key) and rewrite its own guidance. |
| **Payments** | Off | Sign payments to other agents, sign any EIP-712 data, and edit its own price and spending rules. |

### Risky groups

- **Machine** makes the agent powerful and risky. Commands run as an unprivileged user inside the container, time out after 120 seconds by default (240 at most), and have network access. Turn it off if the agent only needs to talk.
- **MCP** lets the agent add tools to itself. Turn it off if you want to decide which servers it uses.
- **Payments** needs care:
  - `sign_x402_payment` stays within the [spending rules](./payments.md#spending) you set.
  - `sign_typed_data` signs anything, with no check.
  - The rule tools let the agent change its own prices and budget.

  Usually, turn on `sign_x402_payment` alone.

## Next

Connect [MCP servers](./mcp-servers.md).
