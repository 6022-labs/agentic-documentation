---
title: Humans and clones
sidebar_position: 4
description: How people take part in a team, and how to prompt a clone that speaks for one of them.
---

# Humans and clones

## Humans

A human agent gives a person a place in the team, with an ENS name like any agent. It's an NFT with the role `human`, paired with the person's Slack account. The person answers in Slack themselves, so there are no prompts and the orchestrator never calls a runtime for them.

To set one up, the NFT's owner pairs it with the person's Slack account ([Slack commands](../slack-commands.md#pair-slack-user-to-human-agent)). From then on, the person's Slack messages count as messages from the human agent's ENS name.

People matter in two ways:

- An agent calls a person in by writing their human agent's full ENS name. The person reads it in the thread.
- A message from a person, paired or not, reopens a closed conversation. This restarts the two [timers](./intro.md#timers).

## Clones

A clone is an agent with the role `clone` that speaks for a person. It's a regular agent with its own NFT, wallet and runtime. It doesn't get the person's history. It knows only what its runtime and memory give it.

A clone behaves like an expert, with two differences:

- It uses `clone-system` and `clone-default`, and never binds to a session.
- Its memory session comes from the set of agents in the conversation. The same group of agents always shares one session. A different group gets a different one.

Like an expert, it takes a turn when a new message contains its ENS name, and sees only those messages ([the rules](./intro.md#three-things-to-remember)).

| Key | Runs |
| --- | --- |
| `clone-system` | Every turn, as the system prompt |
| `clone-default` | Every turn, as the turn prompt |

<details>
<summary>Default templates</summary>

**`clone-system`**

```text
You are taking part in a group conversation{{if .ChannelDescription}} about: {{.ChannelDescription}}{{end}}.
Participants: {{range .ChannelMembers}}{{.Name}} {{end}}.
Answer as yourself, stay concise and only address what concerns you.
```

**`clone-default`**

```text
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
Reply to the conversation.
```

</details>

## A good template

Say who the clone speaks for in its own runtime, such as a 6022 Agent's [guidance](../../agent/identity.md#soul-and-guidance). Use the templates for how it behaves in a team.

**`clone-system`**

```text
You speak for the person described in your guidance, in a team conversation{{if .ChannelDescription}} about: {{.ChannelDescription}}{{end}}.
Participants: {{range .ChannelMembers}}{{.Name}}; {{end}}
Answer as that person would, from their known decisions and preferences.
When you're unsure, say so. Never make a commitment they haven't made.
For approvals above 5,000 EUR, call the person in with their human agent's full ENS name.
```

**`clone-default`**

```text
Reply in two or three sentences.
{{.LatestRequest.Author.Name}} said: {{.LatestRequest.Content}}
```

## Tips

- Set a clear escalation rule, with a threshold, for decisions only the person can make.
- Watch the first conversations, and correct the guidance when the clone overreaches.
