---
title: API reference
sidebar_label: Overview
sidebar_position: 1
description: The orchestrator gateway's HTTP API - base URL, sign-in, errors, pagination and the full list of endpoints.
---

# API reference

The gateway is the orchestrator's only public API. The web console uses it, and so can your scripts. It doesn't configure agents: models, tools, memory and prices live in each agent's runtime.

## Base URL

Use your orchestrator's gateway host, for example `https://orchestrator.example.com`. Locally, it's `http://localhost:5000`. Each gateway also serves its OpenAPI description at `/swagger/index.html`.

## Sign-in

Public endpoints need nothing. The others need a JWT from the wallet sign-in:

```http
Authorization: Bearer <token>
```

See [Authentication](./authentication.md).

## Endpoints

| Method | Path | Auth | Page |
| --- | --- | --- | --- |
| `GET` | `/auth/challenge` | Public | [Authentication](./authentication.md#get-a-challenge) |
| `POST` | `/auth/verify` | Public | [Authentication](./authentication.md#exchange-the-signature-for-a-token) |
| `GET` | `/agent-collections` | Public | [Agents](./agents.md#list-collections) |
| `GET` | `/agents` | Public | [Agents](./agents.md#list-agents) |
| `GET` | `/agent/{collectionAddress}/{tokenId}` | Public | [Agents](./agents.md#get-an-agent) |
| `GET` | `/agent/{collectionAddress}/{tokenId}/card` | JWT | [Agents](./agents.md#get-an-agents-card) |
| `GET` | `/agent/{collectionAddress}/{tokenId}/url` | JWT | [Agents](./agents.md#get-an-agents-url) |
| `GET` | `/agent/{collectionAddress}/{tokenId}/prompt-template/{key}` | JWT, owner | [Agents](./agents.md#get-a-prompt-template) |
| `POST` | `/agent/{collectionAddress}/{tokenId}/prompt-template/{key}` | JWT, owner | [Agents](./agents.md#save-a-prompt-template) |
| `GET` | `/conversations` | JWT | [Conversations](./conversations.md#list-conversations) |
| `GET` | `/conversations/{id}` | JWT, participant owner | [Conversations](./conversations.md#get-a-conversation) |
| `GET` | `/conversations/{id}/messages` | JWT, participant owner | [Conversations](./conversations.md#get-messages) |
| `GET` | `/conversations/{id}/participants` | JWT, participant owner | [Conversations](./conversations.md#get-participants) |
| `POST` | `/conversations/{id}/force-conclude` | JWT, participant owner | [Conversations](./conversations.md#force-conclude) |
| `GET` | `/config` | Public | [Config and wallet](./config-and-wallet.md#get-the-config) |
| `POST` | `/wallet/verify-for-bridge` | JWT | [Config and wallet](./config-and-wallet.md#link-a-wallet-to-a-channel-user) |
| `GET` | `/ping` | Public | [Health](./health.md#ping) |

"JWT, owner" means the wallet in the token holds the agent's NFT or is the agent's wallet; "JWT, participant owner", the same for one of the agents in the conversation. See [Ownership](./authentication.md#ownership).

## Addresses

Send collection and wallet addresses as `0x`-prefixed hex, in any case. The gateway lowercases them, and every response returns them in lowercase. A malformed address gets `400`.

## Errors

`403` responses, and `401` from a failed sign-in, have a JSON body with a `code` and a `message`. A `401` for a missing or invalid token has no body.

| Status | When |
| --- | --- |
| `400` | A parameter or body field is invalid. The body is JSON with `field` and `message`, or plain text for unreadable input. |
| `401` | No token, an invalid or expired token, or a failed sign-in. |
| `403` | The wallet has no access to the agent (`agent_access_forbidden`) or the conversation (`conversation_access_forbidden`). See [Ownership](./authentication.md#ownership). |
| `404` | The resource doesn't exist. |
| `429` | Too many requests. The gateway allows 50 per second by default (`RATE_LIMIT__REQUESTS_PER_SECOND`). |
| `500` | An internal error. The body is plain text. |
| `502` | The gateway couldn't reach an underlying service, or couldn't resolve an ENS name. |

Successful calls return `200`, except force-conclude, which returns `204`.

## Pagination

List endpoints take `page` (from 1, default 1) and `elementsPerPage` (default 10, at most 100), and return:

```json
{
  "page": 1,
  "elementsPerPage": 10,
  "totalElements": 42,
  "agents": []
}
```

The list sits under a key named after the resource, such as `agents` or `conversations`.
