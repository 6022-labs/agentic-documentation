---
title: Template fields
sidebar_position: 5
description: Every field you can use in a prompt template, what it holds for each role, and the Go template syntax around it.
---

# Template fields

Prompts are Go [`text/template`](https://pkg.go.dev/text/template) templates. Every template, for every role, gets the same fields. They are built from the messages the agent can see, so some values differ by role.

## Conversation

| Field | Type | Holds |
| --- | --- | --- |
| `{{.ConversationId}}` | string | The conversation's UUID. |
| `{{.ChannelDescription}}` | string | The conversation description. In Slack, the channel's purpose. Empty if none. |
| `{{.ChannelMembers}}` | list of members | Everyone in the conversation, including the agent itself and people. |
| `{{.ConversationMessageCount}}` | number | How many messages the agent sees this turn. In `facilitator-conclude`, the count is one per message in the conclude turn: the messages, the previous turn prompt, and the reply with `:end:`. |
| `{{.MemorySessionId}}` | string | The memory session this turn runs on. Empty when there is none. |

`{{.MemorySessionId}}` depends on the role:

- Facilitator: the conversation id.
- Expert: the session it picked, or empty until the conversation is [bound](./expert.md#binding).
- Clone: an id derived from the set of agents in the conversation.

## Requests

| Field | Type | Holds |
| --- | --- | --- |
| `{{.InitialRequest.Content}}` | string | Text of the first message the agent sees. |
| `{{.InitialRequest.Author}}` | member | Who wrote it. |
| `{{.LatestRequest.Content}}` | string | Text of the latest message the agent sees. |
| `{{.LatestRequest.Author}}` | member | Who wrote it. |

The facilitator sees the whole thread. Experts and clones don't ([the rules](./intro.md#three-things-to-remember)), so for them `InitialRequest` is the first message that named them.

## Member

`Author` and each item of `ChannelMembers` share this shape.

| Field | Type | Holds |
| --- | --- | --- |
| `.Name` | string | For an agent, its name, like `claims`. For anyone else, their display name. |
| `.IsAgent` | bool | `true` when the member is a registered agent, including human agents. |
| `.EnsDomain` | string | Agents only. The full ENS name, like `claims.acme.137.6022.eth`. |
| `.Owner` | string | Agents only. The owner's wallet address, or empty. |
| `.Addresses` | map | Agents only. The agent's addresses by type. `evm` is its wallet. |
| `.Attributes` | map | Agents only. Its NFT attributes, like `role` or `expertise`. |

:::warning
Reading an agent-only field on a person fails the render, and with it the agent's turn. Guard it with `{{if .IsAgent}}`.
:::

## Syntax you'll use

| Goal | Write |
| --- | --- |
| Optional text | `{{if .ChannelDescription}}about: {{.ChannelDescription}}{{end}}` |
| Loop over members | `{{range .ChannelMembers}}{{.Name}}; {{end}}` |
| Agents only | `{{range .ChannelMembers}}{{if .IsAgent}}{{.EnsDomain}}; {{end}}{{end}}` |
| Read an attribute | `{{index .Attributes "role"}}` |
| Compare | `{{if ne (index .Attributes "role") "facilitator"}}...{{end}}` |

## Rendering rules

- Line breaks, tabs and other control characters are removed before rendering. End every line with punctuation.
- A field that doesn't exist renders as `<no value>`. There is no top-level `{{.Name}}` or `{{.EnsDomain}}`: the agent's own identity isn't a field.
- A syntax error fails every turn of that agent until you fix the template.
- Values are inserted as is. Nothing is escaped.
