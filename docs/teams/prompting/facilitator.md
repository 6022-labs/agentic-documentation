---
title: Facilitator
sidebar_position: 2
description: The facilitator's three prompts, how the end marker closes a conversation, and a template to start from.
---

# Facilitator

The facilitator runs the conversation. It reads every message, calls experts, and writes the conclusion. It has no domain knowledge of its own. See [Designing agents](../agent-design.md).

Its memory session is the conversation itself. Nothing carries over from one conversation to the next.

## The three prompts

| Key | Runs |
| --- | --- |
| `facilitator-system` | Every turn, as the system prompt |
| `facilitator-default` | Every turn, as the turn prompt |
| `facilitator-conclude` | Once, after `:end:` or the [timer](./intro.md#timers) |

<details>
<summary>Default templates</summary>

**`facilitator-system`**

```text
You facilitate a group conversation{{if .ChannelDescription}} about: {{.ChannelDescription}}{{end}}.
Participants: {{range .ChannelMembers}}{{.Name}} {{end}}.
Keep the discussion moving toward the goal stated in the initial request: {{.InitialRequest.Content}}
When you judge the conversation complete, include the marker :end: in your reply.
```

**`facilitator-default`**

```text
The conversation now counts {{.ConversationMessageCount}} messages. Latest from {{.LatestRequest.Author.Name}}: {{.LatestRequest.Content}}
Facilitate the next step.
```

**`facilitator-conclude`**

```text
The conversation is ending now. Write a short conclusion summarizing the outcome for all participants.
```

</details>

The facilitator takes a turn when the conversation starts, then each time its last message is more than 30 seconds old, even when nothing new was said. Every reply is posted. Ask it to stay brief and not repeat itself.

## Ending with `:end:`

The conversation moves to its conclusion when `:end:` appears:

- anywhere in the facilitator's reply, in upper or lower case;
- or in the latest message of the thread, so a person can end it too.

The marker isn't removed, so it shows in Slack.

The orchestrator then gives the facilitator one extra turn, the **conclude turn**, to write the conclusion. On that turn it gets:

- the same system prompt, messages and turn prompt as the turn before;
- its reply that contained `:end:`;
- `facilitator-conclude` as the new turn prompt.

Its reply is posted and the conversation closes.

Without a stop rule, the facilitator rarely writes `:end:`, and the conversation runs until the 5-minute [timer](./intro.md#timers) ends it. Always say when to stop.

## A good template

This facilitator answers support requests. It lists the other agents with their ENS name and role, so it can call them correctly ([the rules](./intro.md#three-things-to-remember)). The request comes last.

**`facilitator-system`**

```text
You facilitate a support conversation{{if .ChannelDescription}} in a channel about: {{.ChannelDescription}}{{end}}.
Agents you can call, by full name: {{range .ChannelMembers}}{{if .IsAgent}}{{if ne (index .Attributes "role") "facilitator"}}{{.EnsDomain}} ({{index .Attributes "role"}}); {{end}}{{end}}{{end}}
Never answer a domain question yourself. Ask the right expert.
To call an expert, write its full name and all the facts it needs in the same message. It sees only messages that name it.
Call at most two experts per message.
When you can answer the request, or after three calls without progress, write :end: at the end of your reply.
The request to answer: {{.InitialRequest.Content}}
```

**`facilitator-default`**

```text
The thread has {{.ConversationMessageCount}} messages.
If you are waiting for an expert, reply only "Waiting for" and its name.
Otherwise, call the next expert or write :end:.
Never repeat what is already in the thread.
Latest message, from {{.LatestRequest.Author.Name}}: {{.LatestRequest.Content}}
```

**`facilitator-conclude`**

```text
Write the final answer to {{.InitialRequest.Author.Name}}.
Start with the answer in one or two sentences.
Then list the facts the experts confirmed, and say what is still uncertain.
Use only what was said in this thread. Stay under 150 words.
```

## Tips

- Put the handoff in the message. `claims.acme.137.6022.eth, what is the status of claim CLM-2025-00142?` works. `claims.acme.137.6022.eth, can you help?` leaves the expert without context.
- Give a stop rule with a number, like "after three calls". A vague "when you're satisfied" rarely ends.
- List agents with `{{range .ChannelMembers}}` instead of typing them. The list stays right when someone joins the channel.
- Keep the system prompt short. It's sent on every turn.
