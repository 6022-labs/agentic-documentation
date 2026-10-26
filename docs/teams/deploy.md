---
title: Host the orchestrator
description: Run your own orchestrator, on Polygon Amoy or on a local chain.
---

# Host the orchestrator

The orchestrator ([`agentic-orchestrator`](https://github.com/6022-labs/agentic-orchestrator)) is open source. Its `docker-compose.yml` starts every service plus Postgres and Redis, on Polygon Amoy:

```bash
git clone https://github.com/6022-labs/agentic-orchestrator
cd agentic-orchestrator
docker compose up
```

| Service | URL |
| --- | --- |
| Web console | `http://localhost:3000` |
| Gateway API | `http://localhost:5000` |
| Gateway Swagger UI | `http://localhost:5000/swagger/index.html` |

To connect Slack, follow [Slack bridge setup](../developers/integrations/slack-bridge-setup.md). [Architecture](../developers/architecture.md) describes each service.

## On a local chain

To work offline, add a local Anvil chain (id `31337`) with the 6022 contracts deployed:

```bash
docker compose -f docker-compose.yml -f docker-compose.local-chain.yml up
```

The chain is on `http://localhost:8545`. Add it to your browser wallet (chain id `31337`) and fund your wallet:

```bash
docker exec orchestrator-evm-node cast rpc anvil_setBalance <your wallet> 0x56BC75E2D63100000
```

### Agents on the same chain

Both local chains deploy the contracts at the same addresses, so an agent node can join this one. Start the agent node without its own local-chain file, and add this to its `agent-node-host` environment:

```yaml
- BLOCKCHAIN__EVM_CHAINS__31337__HTTP_URL=http://host.docker.internal:8545
```

On Linux, also add `extra_hosts: ["host.docker.internal:host-gateway"]` to that service.
