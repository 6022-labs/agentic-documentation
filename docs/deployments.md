---
title: Deployments
description: The chains 6022 runs on, with contract addresses, RPC, faucet and payment facilitator for each.
---

# Deployments

6022 runs on EVM chains. An agent's chain is part of its name: `claims.acme.137.6022.eth` lives on chain `137`.

| Chain | Chain id | Gas token | Use it for |
| --- | --- | --- | --- |
| [Polygon](#polygon) | `137` | POL | Real agents |
| [Polygon Amoy](#polygon-amoy) | `80002` | POL (free, from a faucet) | Testing |

No other chain has the contracts yet.

## Polygon

| | |
| --- | --- |
| Chain id | `137` |
| Explorer | [polygonscan.com](https://polygonscan.com) |
| Public RPC | `https://polygon.drpc.org` |
| x402 facilitator | `https://x402.polygon.technology` |

| Contract | Role | Address |
| --- | --- | --- |
| AgentCollectionsManager | Identity: lists the collections | [`0xb0dc8a83c700A9BBcc53cA1a2C6993a63129d2F6`](https://polygonscan.com/address/0xb0dc8a83c700A9BBcc53cA1a2C6993a63129d2F6) |
| AgentCollectionCreatorV1 | Identity: creates collections | [`0x6919B4A31b27cf5Be422a88F3259f5C7B9470BEa`](https://polygonscan.com/address/0x6919B4A31b27cf5Be422a88F3259f5C7B9470BEa) |
| AgentEnsRegistry | Naming: stores the ENS records | [`0x23dbc335f966d9869940FB55f61E919118AAD236`](https://polygonscan.com/address/0x23dbc335f966d9869940FB55f61E919118AAD236) |
| AgentCollectionsDescriptor | Identity: renders NFT metadata | [`0x7462D55bD41DE313e739d5DA6acfE926952ABbf3`](https://polygonscan.com/address/0x7462D55bD41DE313e739d5DA6acfE926952ABbf3) |
| Token6022 ($6022) | Token | [`0xCDB1DDf9EeA7614961568F2db19e69645Dd708f5`](https://polygonscan.com/address/0xCDB1DDf9EeA7614961568F2db19e69645Dd708f5) |

## Polygon Amoy

| | |
| --- | --- |
| Chain id | `80002` |
| Explorer | [amoy.polygonscan.com](https://amoy.polygonscan.com) |
| Public RPC | `https://rpc-amoy.polygon.technology` |
| Faucet | [faucet.polygon.technology](https://faucet.polygon.technology) |
| x402 facilitator | `https://x402-amoy.polygon.technology` |

| Contract | Role | Address |
| --- | --- | --- |
| AgentCollectionsManager | Identity: lists the collections | [`0x8095A0D4bE42A61db9e609aA693f516044Bda990`](https://amoy.polygonscan.com/address/0x8095A0D4bE42A61db9e609aA693f516044Bda990) |
| AgentCollectionCreatorV1 | Identity: creates collections | [`0x94EbaBD4796D0A8d1d416B6696559dE2C5E9F0a1`](https://amoy.polygonscan.com/address/0x94EbaBD4796D0A8d1d416B6696559dE2C5E9F0a1) |
| AgentEnsRegistry | Naming: stores the ENS records | [`0x37c5879529E5b0241663ed40feeebb2326BBEE0d`](https://amoy.polygonscan.com/address/0x37c5879529E5b0241663ed40feeebb2326BBEE0d) |
| AgentCollectionsDescriptor | Identity: renders NFT metadata | [`0x21D3E43A8b057609C3DC8f12dd3861fD2560754A`](https://amoy.polygonscan.com/address/0x21D3E43A8b057609C3DC8f12dd3861fD2560754A) |
| Token6022 ($6022) | Token | [`0x26adaf578361953e8F1aC86D3e4Ca153493af5cB`](https://amoy.polygonscan.com/address/0x26adaf578361953e8F1aC86D3e4Ca153493af5cB) |

## ENS

Every name ends in `6022.eth`. Its resolver, `AgentEnsOffchainResolver`, reads the records from the `AgentEnsRegistry` of the chain in the name.

| ENS network | Resolver |
| --- | --- |
| Ethereum | [`0x7462D55bD41DE313e739d5DA6acfE926952ABbf3`](https://etherscan.io/address/0x7462D55bD41DE313e739d5DA6acfE926952ABbf3) |
| Sepolia (testing) | [`0xa3f6011779B55BB155BDAcd25Dd5Bcb9f5597646`](https://sepolia.etherscan.io/address/0xa3f6011779B55BB155BDAcd25Dd5Bcb9f5597646) |

You don't mint into `AgentCollectionV1` directly: it's the template each new collection is copied from. Mint into a collection's own address.
