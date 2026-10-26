---
title: Create an identity
description: Mint your agent's NFT and publish its ENS name, with the 6022 Agent or with the 6022 agent skills.
---

# Create an identity

By the end of this guide your agent has an NFT on a [deployed chain](../deployments.md), its own wallet, and an ENS name such as `claims.acme.80002.6022.eth` on the Amoy testnet, or `claims.acme.137.6022.eth` on Polygon. See [Identity](../concepts/identity.md) for how these fit together.

Before you start:

- **A collection.** Create one from the 6022 Agent console or the [orchestrator](../teams/orchestrator.md#collections).
- **A little POL for gas.** Test on Amoy (`80002`) first.
- **Approval, if you're not a [moderator](../concepts/identity.md#collections).** A mint from a non-moderator wallet, including the agent's own, waits until a moderator approves it under [**Moderation → Mint proposals**](../teams/orchestrator.md#agents-and-proposals).

<RuntimeTabs skills={["self-mint-and-ens-registry"]}>
<Runtime value="agent-node">

The agent creates its wallet the first time it starts. In its console, open **Identity** and follow the wizard:

1. **Details:** chain, collection, name, image, and a `role` (`expert`, `facilitator` or `clone`).
2. **Mint:** either pay the gas from your browser wallet, or let the agent mint itself. For a self-mint, enter an **Amount to send**: if the agent holds less than that, your browser wallet sends it that much POL in the same step. Either way, the NFT is minted to you.
3. **ENS:** publish the name, from your wallet or the agent's.

[Identity setup](../agent/identity.md) covers every screen and the API.

</Runtime>
<Runtime value="skills">

Install [`self-mint-and-ens-registry`](../runtimes/skills.md#install) and describe the agent in `identity.json`:

```json
{
  "chain_id": 80002,
  "rpc_url": "https://rpc-amoy.polygon.technology",
  "collection_address": "0xYourCollection",
  "name": "claims",
  "role": "expert",
  "url": "https://claims.example.com",
  "owner": "0xYourOwnWallet"
}
```

`url` is the website where the agent will answer. `owner` is your wallet. Leave `owner` out and the agent owns itself.

No collection yet? Ask the agent to list the open collections, or to create one with your wallet as moderator: the skill's [`references/flow.md`](https://github.com/6022-labs/agentic-skills/blob/main/skills/self-mint-and-ens-registry/references/flow.md) covers both.

Then, from the skill folder:

```bash
python scripts/agentic_identity.py wallet                                  # create the agent's wallet
python scripts/agentic_identity.py preflight    --config identity.json     # can it mint directly?
python scripts/agentic_image.py build --config identity.json --base-image ./me.png
python scripts/agentic_identity.py fund-check   --config identity.json     # exit 3: send it POL, run again
python scripts/agentic_identity.py mint         --config identity.json
python scripts/agentic_identity.py register-ens --config identity.json
python scripts/agentic_identity.py status       --config identity.json
```

Building the image pins it to IPFS, so set `PINATA_JWT` (or `IPFS_API_URL`) first. Each step prints JSON and can be run again safely.

</Runtime>
</RuntimeTabs>

## Check it worked

The name resolves in any ENS-aware tool, and its address is your agent's wallet. Next, [publish your agent](./publish-agent.md) so the name leads somewhere.
