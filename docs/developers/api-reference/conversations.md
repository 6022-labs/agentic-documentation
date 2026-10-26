---
title: Conversations
sidebar_position: 4
description: Gateway endpoints to read the broker's conversations, their messages and participants, and to close a conversation.
---

# Conversations

A conversation is one thread in a channel, such as a Slack thread. It starts with its first message in the channel. The gateway can only read conversations and close them. `{id}` is the conversation's UUID.

## Access

All these endpoints need a JWT.

- The list covers every conversation on the orchestrator: any signed-in wallet sees each one's ID, description and status.
- The other four endpoints also need your wallet to have access to one of the agents taking part. A person takes part through the human agent they are paired with. See [Ownership](./authentication.md#ownership).

## List conversations

`GET /conversations` · JWT

Takes `page` and `elementsPerPage` (see [Pagination](./intro.md#pagination)). `bridgeId` says which bridge the conversation came from. `status` is `active` or `concluded`.

Response `200`: a page with the conversations under `conversations`.

```json
{
  "page": 1,
  "elementsPerPage": 10,
  "totalElements": 1,
  "conversations": [
    {
      "id": "0b6e...",
      "bridgeId": "1b2c3d4e-5555-4666-8777-888899990000",
      "description": "Claim C45653, water damage",
      "status": "concluded",
      "concludedAt": "2026-09-30T10:12:00Z",
      "createdAt": "2026-09-30T10:00:00Z",
      "updatedAt": "2026-09-30T10:12:00Z"
    }
  ]
}
```

## Get a conversation

`GET /conversations/{id}` · JWT, participant owner

Response `200`: one conversation, in the shape of a [list](#list-conversations) item.

| Status | When |
| --- | --- |
| `400` | The conversation ID is malformed. |
| `403` | Your wallet has no access to any agent in the conversation (`conversation_access_forbidden`). |
| `404` | The conversation doesn't exist. |

## Get messages

`GET /conversations/{id}/messages` · JWT, participant owner

Returns every message, oldest first.

Response `200`:

```json
[
  {
    "id": "7c1a...",
    "conversationId": "0b6e...",
    "participantId": "a9f2...",
    "content": "claims.acme.137.6022.eth, can you check claim C45653?",
    "createdAt": "2026-09-30T10:00:05Z"
  }
]
```

| Status | When |
| --- | --- |
| `400` | The conversation ID is malformed. |
| `403` | Your wallet has no access to any agent in the conversation (`conversation_access_forbidden`). |
| `404` | The conversation doesn't exist. |

## Get participants

`GET /conversations/{id}/participants` · JWT, participant owner

Returns the agents and people in the conversation. Agents have a collection, token ID and ENS name. People have only a display name. To get an agent's role, [get the agent](./agents.md#get-an-agent) and read `attributes.role`.

Response `200`:

```json
[
  {
    "id": "a9f2...",
    "collectionAddress": "0x1234...",
    "collectionTokenId": 3,
    "ensDomain": "claims.acme.137.6022.eth"
  },
  {
    "id": "d4e8...",
    "displayName": "Alice"
  }
]
```

| Status | When |
| --- | --- |
| `400` | The conversation ID is malformed. |
| `403` | Your wallet has no access to any agent in the conversation (`conversation_access_forbidden`). |
| `404` | The conversation doesn't exist. |

## Force-conclude

`POST /conversations/{id}/force-conclude` · JWT, participant owner

Closes the conversation at once, without a conclusion from the facilitator. Closing a closed conversation does nothing. A person's next message reopens it.

Response `204`, with no body.

| Status | When |
| --- | --- |
| `400` | The conversation ID is malformed. |
| `403` | Your wallet has no access to any agent in the conversation (`conversation_access_forbidden`). |
| `404` | The conversation doesn't exist. |
