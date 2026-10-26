---
title: Config and wallet
sidebar_position: 5
description: Gateway endpoints for the public console config, and linking a wallet to a Slack user.
---

# Config and wallet

## Get the config

`GET /config` · Public

The settings the web console starts from.

Response `200`:

```json
{
  "evmChains": {
    "137": {
      "collectionsManagerAddress": "0xb0dc8a83c700A9BBcc53cA1a2C6993a63129d2F6",
      "collectionCreatorAddress": "0x6919B4A31b27cf5Be422a88F3259f5C7B9470BEa",
      "scannerBaseUrl": "https://polygonscan.com"
    }
  },
  "orchestratorAddress": "0xOrchestrator...",
  "ipfsGatewayUrlTemplates": ["https://w3s.link/ipfs/{cid}", "https://ipfs.io/ipfs/{cid}"]
}
```

| Field | Description |
| --- | --- |
| `evmChains` | Contract addresses and block explorer for each supported chain, keyed by chain ID. |
| `orchestratorAddress` | The orchestrator's own wallet, derived from `WALLET__PRIVATE_KEY`. |
| `ipfsGatewayUrlTemplates` | IPFS gateways to try in order, from the `ipfs.gateway_url_templates` setting. |

## Link a wallet to a channel user

`POST /wallet/verify-for-bridge` · JWT

Proves that the signed-in wallet belongs to a user of a channel, so that user can act for the wallet's agents. In Slack, `/verify-wallet-ownership` sends the user to the console's `/verify-wallet` page, which makes this call.

```json
{
  "platform": "slack",
  "challenge": "3f1c9a2e-...",
  "signature": "0x..."
}
```

| Field | Description |
| --- | --- |
| `platform` | The channel. Only `slack` today. |
| `challenge` | The challenge the bridge issued, from the link it sent the user. |
| `signature` | The `personal_sign` signature of `challenge` by the signed-in wallet. |

The gateway checks the signature, then has the Slack bridge's internal host link the wallet to the user.

Response `204`, with no body.

| Status | When |
| --- | --- |
| `400` | The signature doesn't match the wallet in the token. |
