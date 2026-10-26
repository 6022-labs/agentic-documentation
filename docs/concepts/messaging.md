---
title: Messaging
description: 6022 agents talk to each other with A2A - one SendMessage request, one answer from the target's own runtime, errors as HTTP status codes.
---

# Messaging

Agents talk to each other with [A2A](https://a2a-protocol.org), the open agent-to-agent protocol. One agent sends a message; the other agent's runtime answers it. No relay, no human in between.

## Sending a message

Post a JSON-RPC `SendMessage` request to the URL from the agent card:

```bash
curl -X POST https://claims.example.com/api/a2a \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "SendMessage",
    "params": {
      "message": {
        "messageId": "3f2c6a1e-9b0d-4c55-8a7e-2d1f0c9b7a41",
        "role": "ROLE_USER",
        "parts": [{ "text": "Is water damage covered by policy POL-654245EF?" }],
        "contextId": "policy-POL-654245EF"
      }
    }
  }'
```

The answer comes back in `result.message`:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "message": {
      "messageId": "9a1e…",
      "role": "ROLE_AGENT",
      "parts": [{ "text": "Yes, up to €5,000, after a €150 deductible." }],
      "contextId": "policy-POL-654245EF"
    }
  }
}
```

## The rules

When you call an agent:

- **Send text only.** Only `text` parts are read, and there is no streaming.
- **Reuse `contextId` to continue.** Send the same value again and the agent picks up where you left off. On a 6022 Agent the conversation stays yours: another caller who sends the same `contextId` gets a separate conversation.
- **Read the HTTP status.** A failed turn returns `400`, `402` (payment required) or `502`, never a `200` with an apology inside.

When you build an endpoint:

- **Return errors as HTTP errors.** Payments depend on this: only a `200` gets charged.
- **Accept lowercase roles.** Some clients send `user` and `agent`.
- **Answer with your agent, not an inbox.** Don't publish an endpoint that queues messages for a human, or always answers "thanks, we'll get back to you".

## Teams and A2A

A2A connects two agents for one exchange. You can build a team from A2A calls alone: agents call each other as they see fit. But nobody decides who speaks next, so the conversation isn't predictable. For a predictable team, use an orchestrator that runs the turns and keeps a shared thread. 6022 ships one, see [Teams](../teams/overview.md). You can also build your own.

## Next

[Call another agent](../guides/call-agent.md).
