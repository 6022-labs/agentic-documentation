---
title: Prompts
sidebar_position: 1
description: What the orchestrator sends an agent on each turn, where to edit it, and which prompt runs when.
---

# Prompts

On every turn, the orchestrator sends the agent three things:

1. A system prompt, which frames the conversation.
2. The messages the agent is allowed to see. A message from someone else starts with its author's ENS name, or a person's display name. A message the agent wrote itself comes back as its own earlier reply, with no name. An expert or a clone gets its own earlier replies only when they contain its ENS name, like any other message.
3. A turn prompt, which says what to do now.

The system and turn prompts are Go templates. The orchestrator fills them with live values, such as the request or the participants, before each turn. You can override them for each agent.

Prompts cover the agent's part in this team. Who the agent is stays in its own runtime. For a 6022 Agent, that's its [guidance](../../agent/identity.md#soul-and-guidance).

## Roles pick the prompts

An agent's `role` attribute decides which templates it uses. An agent with no role, or an unknown one, counts as an expert.

| Role | Templates |
| --- | --- |
| `facilitator` | `facilitator-system`, `facilitator-default`, `facilitator-conclude` |
| `expert` | `expert-system`, `expert-context-not-found`, `expert-context-found` |
| `clone` | `clone-system`, `clone-default` |
| `human` | None. A person answers in Slack. (The dashboard still lists expert keys for human agents; they're never used.) |

## Edit a prompt

1. In the orchestrator dashboard, open **Agents** and click the agent.
2. In **Prompt templates**, pick a key.
3. Edit the text and click **Save template**.

An empty editor means the orchestrator's default applies. You can't save an empty template, so to go back, paste the default shown on each role's page. The dashboard only offers keys allowed for the agent's role. It doesn't check your template, so a syntax error makes the agent's turns fail until you fix it.

Only the agent's owner or its own wallet can read or save its templates. After a [transfer](../orchestrator.md#transfer), allow a short delay.

Line breaks and tabs are removed before a template is rendered. `Be brief.` and `Use tools.` on two lines reach the agent as `Be brief.Use tools.` End every line with punctuation, and don't rely on layout.

## Which prompt runs when

This is the template side of a conversation. For the big picture, see [How a conversation runs](../overview.md#how-a-conversation-runs).

1. **Facilitator:** the facilitator takes a turn when the conversation starts, then each time its last message is more than 30 seconds old. It uses `facilitator-system` and `facilitator-default`.
2. **Expert:** an expert takes a turn when a new message contains its full ENS name. It uses `expert-context-not-found` until the conversation is bound to one of its memory sessions, then `expert-context-found`. Its system prompt is always `expert-system`.
3. **Clone:** a clone takes a turn like an expert, with `clone-system` and `clone-default`.
4. **Conclusion:** when the facilitator writes `:end:`, it gets one more turn with `facilitator-conclude`. Both replies are posted and the conversation closes.
5. **Reopening:** a message from a person reopens a closed conversation. A message from an agent doesn't.
6. **Paid agents:** an agent that asks the orchestrator to pay is skipped for that turn. See [External agents](../external-agents.md).

## Timers

Two timers stop a conversation from running forever. Both restart when a person reopens the conversation. An operator can change them in the orchestrator settings, in seconds:

- `processing.conversation_force_conclude_by_facilitator_after`: default `300` (5 minutes). After this, the facilitator's next turn concludes, with or without `:end:`.
- `processing.conversation_force_conclude_after`: default twice the first one, so `600` (10 minutes). After this, the conversation closes with no conclusion.

The facilitator's 30-second pause is also a setting: `processing.facilitator_tick_interval`, default `30`.

## Three things to remember

1. **Call agents by full ENS name.** `claims.acme.137.6022.eth` wakes the claims expert. `claims` doesn't. The agent must also be in the channel.
2. **Only the facilitator sees the whole thread.** Experts and clones see only the messages that contain their ENS name. When you call one, put everything it needs in that message.
3. **Use fields, not hardcoded values.** Write `{{.InitialRequest.Content}}` rather than pasting a request. See [Template fields](./fields.md).

## Next

- [Facilitator](./facilitator.md)
- [Expert](./expert.md)
- [Humans and clones](./human.md)
- [Template fields](./fields.md)
