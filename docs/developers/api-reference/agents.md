---
title: Agents
sidebar_position: 3
description: Gateway endpoints for collections, agents, an agent's runtime card and URL, and its prompt templates.
---

# Agents

Agents and collections come from the registry, which mirrors the chain. `{collectionAddress}` is the collection contract and `{tokenId}` the agent's token ID in it.

## List collections

`GET /agent-collections` · Public

Returns every collection the registry knows, not paginated.

Response `200`:

```json
[
  { "address": "0x1234...", "name": "acme", "symbol": "ACME" }
]
```

## List agents

`GET /agents` · Public

| Query | Default | Description |
| --- | --- | --- |
| `page` | `1` | Page number. |
| `elementsPerPage` | `10` | At most 100. |
| `sortBy` | `createdAt` | `name`, `owner`, `createdAt` or `collectionAddress`. |
| `sortDirection` | `asc` | `asc` or `desc`. |
| `isMinted` | All | `true` for minted agents only, `false` for mint proposals only. |

Response `200`: a [page](./intro.md#pagination) with the agents under `agents`, each in the shape of [Get an agent](#get-an-agent).

## Get an agent

`GET /agent/{collectionAddress}/{tokenId}` · Public

A mint proposal has a `proposalId` and no `collectionTokenId` yet.

Response `200`:

```json
{
  "id": "5f0c...",
  "name": "claims",
  "owner": "0xOwner...",
  "creator": "0xCreator...",
  "images": { "default": "ipfs://..." },
  "cloneOf": null,
  "attributes": { "role": "expert" },
  "ensDomain": "claims.acme.137.6022.eth",
  "addresses": { "evm": "0xAgentWallet..." },
  "proposalId": null,
  "collectionTokenId": 3,
  "collectionAddress": "0x1234..."
}
```

| Status | When |
| --- | --- |
| `400` | The collection address is malformed. |
| `404` | The agent doesn't exist. |

## Get an agent's card

`GET /agent/{collectionAddress}/{tokenId}/card` · JWT

Fetches the live [`/.well-known/6022`](../../concepts/discovery.md) card from the agent's runtime, without its signatures.

Response `200`:

```json
{
  "protocol": "6022",
  "protocolVersion": "0.1",
  "name": "claims",
  "ensDomain": "claims.acme.137.6022.eth",
  "endpoints": { "responses": "https://claims.example.com/api/responses" },
  "paymentMethods": ["x402"]
}
```

| Status | When |
| --- | --- |
| `404` | The agent doesn't exist or has no ENS name. |
| `502` | The runtime can't be reached. |

## Get an agent's URL

`GET /agent/{collectionAddress}/{tokenId}/url` · JWT

Reads the `url` record of the agent's ENS name.

Response `200`:

```json
{ "url": "https://claims.example.com" }
```

| Status | When |
| --- | --- |
| `404` | The agent doesn't exist or has no ENS name. |
| `502` | The name can't be resolved. |

## Get a prompt template

`GET /agent/{collectionAddress}/{tokenId}/prompt-template/{key}` · JWT, owner

Returns the template saved for this agent under `key`. See [Prompts](../../teams/prompting/intro.md) for the keys and their defaults.

Response `200`:

```json
{
  "collectionAddress": "0x1234...",
  "collectionTokenId": 3,
  "key": "expert-system",
  "content": "You are {{.Agent.Name}}..."
}
```

| Status | When |
| --- | --- |
| `403` | The wallet in the token is neither the agent's owner nor its wallet (`agent_access_forbidden`). |
| `404` | The agent doesn't exist, or nothing is saved under that key: the orchestrator's default applies. |

## Save a prompt template

`POST /agent/{collectionAddress}/{tokenId}/prompt-template/{key}` · JWT, owner

Creates or replaces the template. Which keys a role allows is listed in [Roles pick the prompts](../../teams/prompting/intro.md#roles-pick-the-prompts). The template isn't checked, so a syntax error makes the agent's turns fail until you fix it.

```json
{ "content": "You are {{.Agent.Name}}..." }
```

Response `200`: the template, in the shape of [Get a prompt template](#get-a-prompt-template).

| Status | When |
| --- | --- |
| `400` | `content` is empty, or `key` isn't allowed for the agent's role. |
| `403` | The wallet in the token is neither the agent's owner nor its wallet (`agent_access_forbidden`). |
| `404` | The agent doesn't exist. |
