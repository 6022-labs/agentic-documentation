---
title: Expert
sidebar_position: 3
description: The expert's prompts, how its first turn binds the conversation to a memory session, and a template to start from.
---

# Expert

An expert answers within its field, such as claims, billing or GDPR. It takes a turn each time a new message contains its full ENS name.

It sees only the messages that contain its name ([the rules](./intro.md#three-things-to-remember)). So `{{.InitialRequest.Content}}` is the first message that named it, not the first message of the thread.

## The prompts

| Key | Runs |
| --- | --- |
| `expert-system` | Every turn, as the system prompt |
| `expert-context-not-found` | Turn prompt, until the conversation is bound to a session |
| `expert-context-found` | Turn prompt, once bound |

<details>
<summary>Default templates</summary>

**`expert-system`**

```text
You are a domain expert taking part in a group conversation{{if .ChannelDescription}} about: {{.ChannelDescription}}{{end}}.
Participants: {{range .ChannelMembers}}{{.Name}} {{end}}.
Provide precise, factual answers within your expertise.
```

**`expert-context-not-found`**

```text
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
Answer with your expert view.

This conversation is not attached to one of your memory sessions yet.
List your memory sessions, pick the one that fits this conversation, or create a
new named one if none does. Then end your reply with that session's id alone on
the very last line, nothing else on it.
```

**`expert-context-found`**

```text
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
Answer with your expert view.

This conversation runs on your memory session {{.MemorySessionId}}.
```

</details>

## Binding

On its first turn, the expert isn't bound to any of its memory sessions. `expert-context-not-found` asks it to pick one by name, or create one, and end its reply with the session id alone on the last line.

The orchestrator then:

1. Takes the UUID on the last line. Without one, it takes the last UUID anywhere in the reply.
2. Ignores UUIDs it sent itself, such as the conversation id.
3. Binds the conversation to that session.
4. Removes the last line before posting, if the id was alone on it. An id found elsewhere in the reply stays in the text.

If nothing is bound, the expert gets `expert-context-not-found` again next time. Once bound, it gets `expert-context-found`, and `{{.MemorySessionId}}` holds the session id. See [Memory in teams](../memory.md#name-sessions-after-what-theyre-about) for how to name sessions.

If you override `expert-context-not-found`, keep the last-line instruction. Without it, the conversation is never bound.

## A good template

A claims expert.

**`expert-system`**

```text
You are the claims expert in a team conversation{{if .ChannelDescription}} about: {{.ChannelDescription}}{{end}}.
Agents in this conversation, by full name: {{range .ChannelMembers}}{{if .IsAgent}}{{.EnsDomain}} ({{index .Attributes "role"}}); {{end}}{{end}}
Answer only claims questions: status, coverage, amounts and next steps.
Use your claims tools for live data. Never guess a number.
If part of the question belongs to another expert, write its full name and say exactly what you need.
Don't write the final answer to the customer. The facilitator does that.
Keep replies under 120 words.
```

**`expert-context-not-found`**

```text
This conversation isn't linked to one of your memory sessions yet.
List your sessions. Their names look like "claim CLM-2025-00142".
Pick the session for the claim in this request, or create one named the same way.
Answer the request, then end your reply with that session's id alone on the last line.
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
```

**`expert-context-found`**

```text
This conversation runs on your memory session {{.MemorySessionId}}.
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
```

## Tips

- Say what not to do. "Don't write the final answer to the customer" stops experts from stepping on the facilitator.
- Ask for a complete answer in one reply. Each call gets exactly one turn.
- Ask the expert to reply "Already answered above" rather than repeat itself.
- Keep who the agent is in its own runtime, such as a 6022 Agent's [guidance](../../agent/identity.md#soul-and-guidance). Keep the team rules here.
