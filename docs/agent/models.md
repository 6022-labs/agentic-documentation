---
title: Models
description: Connect a 6022 Agent to a model - Anthropic, OpenAI, Mistral, DeepSeek, xAI, LibertAI, Amazon Bedrock or a local model with Ollama.
---

# Models

A 6022 Agent reasons with one model. Choose it on the **LLM** page: pick a provider, a model, paste the API key and save. The key goes to Vault and is never shown again.

<Screenshot name="llm" alt="LLM page with an OpenAI connection saved" />

Once the agent is minted, send a first message in **Playground** before anything else. If that works, later problems are not about the model.

## Providers

| Provider | API key | Current models |
| --- | --- | --- |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | [Models](https://platform.claude.com/docs/en/models/overview) |
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) | [Models](https://developers.openai.com/api/docs/models) |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) | [Models](https://docs.mistral.ai/getting-started/models/) |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) | [Models](https://api-docs.deepseek.com/quick_start/pricing) |
| xAI | [console.x.ai](https://console.x.ai/) | [Models](https://docs.x.ai/docs/models) |
| LibertAI | [libertai.io](https://libertai.io) | [Models](https://docs.libertai.io/apis/text/) |
| Amazon Bedrock | AWS console, see below | [Models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html) |
| Ollama | None, see below | [Library](https://ollama.com/library) |

Copy the exact model id from the provider's page, and pick a model that supports tool calling.

Hosted providers are the quickest way to start, but your prompts go through them. If that matters, run an open-source model yourself with Ollama.

## Amazon Bedrock

Set the base URL to the regional endpoint, for example `https://bedrock-runtime.us-east-1.amazonaws.com`. The console reads the region from it. The key must be an **Amazon Bedrock API key** (IAM access keys don't work). Request access to the model in that region first.

## Ollama

Run Ollama on a machine the agent can reach:

```bash
ollama pull <model>
OLLAMA_HOST=0.0.0.0 ollama serve
```

Then pick **Ollama**, enter the model name exactly as `ollama list` shows it, and the base URL. The agent runs in a container, so `localhost` won't work: use `http://host.docker.internal:11434` on the same machine, or the machine's network address.

A 7B model needs about 8 GB of RAM, a 70B model about 64 GB. A GPU makes a big difference.

## When it doesn't answer

| Symptom | What to check |
| --- | --- |
| `401` or `403` | The key belongs to this provider and the account can use this model. |
| `404` | The model name, and the base URL if there is one. |
| `429` | You hit the provider's rate limit. Wait or lower traffic. |
| Connection refused (Ollama) | `ollama serve` is running and reachable from the container. |
| Model not found (Ollama) | The name matches `ollama list` exactly. |

If the same key and model work outside the agent, the problem is the configuration. Otherwise it's the provider.

## Next

Choose the agent's [tools](./tools.md).
