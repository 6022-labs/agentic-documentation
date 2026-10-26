---
title: Slack bridge setup
sidebar_position: 1
description: Create the Slack app from its manifest, deploy the bridge's external and internal hosts, and connect them to the orchestrator.
---

# Slack bridge setup

This page is for whoever runs the orchestrator. It sets up the Slack app and the bridge once per workspace. To use agents in Slack afterwards, see [Slack](../../teams/slack.md) and [Slash commands](../../teams/slack-commands.md).

## Two hosts

The bridge runs as two services built from the same code:

| Host | Reachable from | Serves |
| --- | --- | --- |
| External | Slack, so the public internet | `/event-handler` for Slack events, `/command-handler/*` for slash commands. Checks Slack's request signature. |
| Internal | The orchestrator's private network only | `/broker/callback` for the broker's replies, `/wallet/set-ownership-to-slack-user` for the gateway. |

Both hosts share the same database, Redis and Slack credentials, and register the same bridge with the broker. See [Architecture](../architecture.md#how-a-turn-runs) for how a message goes through them.

## 1. Create the Slack app

In [Slack's app settings](https://api.slack.com/apps), choose **Create New App → From an app manifest** and paste the manifest below. Replace `slack-bridge.example.com` with your external host. The same manifest is in the orchestrator repository, at `channels-and-integrations/slack-bridge/app_manifest.json`.

```json
{
  "display_information": {
    "name": "6022"
  },
  "features": {
    "bot_user": {
      "display_name": "6022",
      "always_online": false
    },
    "slash_commands": [
      {
        "command": "/add-agent",
        "url": "https://slack-bridge.example.com/command-handler/add-agent-to-channel",
        "description": "Add a agent to the channel",
        "usage_hint": "[collection address] [token ID]",
        "should_escape": false
      },
      {
        "command": "/remove-agent",
        "url": "https://slack-bridge.example.com/command-handler/remove-agent-from-channel",
        "description": "Remove a agent from the channel",
        "usage_hint": "[collection address] [token ID]",
        "should_escape": false
      },
      {
        "command": "/list-agents",
        "url": "https://slack-bridge.example.com/command-handler/list-agents-in-channel",
        "description": "List all agents in the channel",
        "should_escape": false
      },
      {
        "command": "/verify-wallet-ownership",
        "url": "https://slack-bridge.example.com/command-handler/verify-wallet-ownership",
        "description": "Verify wallet ownership",
        "should_escape": false
      },
      {
        "command": "/pair-slack-user-to-human-agent",
        "url": "https://slack-bridge.example.com/command-handler/pair-slack-user-to-human-agent",
        "description": "Pair a Slack user to a human agent",
        "usage_hint": "[slack user id] [collection address] [token ID]",
        "should_escape": false
      }
    ]
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "app_mentions:read",
        "channels:history",
        "channels:join",
        "channels:read",
        "chat:write",
        "chat:write.customize",
        "chat:write.public",
        "commands",
        "files:read",
        "groups:history",
        "groups:read",
        "groups:write",
        "im:history",
        "links:read",
        "links:write",
        "metadata.message:read",
        "mpim:history",
        "mpim:read",
        "users.profile:read",
        "users:read",
        "users:read.email",
        "im:read",
        "im:write",
        "mpim:write"
      ]
    }
  },
  "settings": {
    "event_subscriptions": {
      "request_url": "https://slack-bridge.example.com/event-handler",
      "bot_events": [
        "channel_created",
        "message.channels",
        "message.groups",
        "message.im",
        "message.mpim"
      ]
    },
    "org_deploy_enabled": false,
    "socket_mode_enabled": false,
    "token_rotation_enabled": false
  }
}
```

A few things to know about it:

- Every URL points at the **external** host. The command paths differ from the command names: `/add-agent` goes to `/command-handler/add-agent-to-channel`.
- `chat:write.customize` lets the bot post each reply under the agent's name and image.
- `message.channels` and `message.groups` are **events**, not scopes. `message.groups` delivers private channel messages, which also need the `groups:history` scope and the bot invited to the channel.
- Edits and deletions arrive as subtypes of the message events. You don't subscribe to them separately.

Slack verifies the event URL when you save, so the external host must already be running. If it isn't, save the manifest without `event_subscriptions` first and add it back once the host is up.

Then install the app to the workspace and note, from the app settings:

- **Basic Information → App Credentials**: the app ID, client secret and signing secret;
- **OAuth & Permissions**: the bot token (`xoxb-...`).

## 2. Deploy the hosts

Each setting can go in `appsettings.json` or in an environment variable, where `__` separates levels (`SLACK__BOT_TOKEN` is `slack.bot_token`).

Settings for both hosts:

| Variable | Description |
| --- | --- |
| `SLACK__APP_ID`, `SLACK__CLIENT_SECRET`, `SLACK__SIGNING_SECRET`, `SLACK__BOT_TOKEN` | From the Slack app. Required. |
| `SLACK__ACCEPTED_CHANNEL_PREFIX` | The bot joins new public channels whose name starts with this. Default `ai`. |
| `DATABASE__URL` | Postgres connection string. Required. |
| `MIGRATIONS__FOLDER_PATH` | Where the SQL migrations are. The Docker images set it. |
| `REDIS__HOST`, `REDIS__PASSWORD`, `REDIS__DB` | Redis for the Slack user and channel sync. `REDIS__HOST` is required. |
| `CONVERSATION_BROKER__BASE_URL` | The broker's URL. Required. |
| `CONVERSATION_BROKER__CALLBACK_URL` | The **internal** host's URL, without a path. The broker adds `/broker/callback`. Required. |
| `CONVERSATION_BROKER__BRIDGE_ID` | Any UUID, the same on both hosts and stable across deploys. Required. |

Only on the external host:

| Variable | Description |
| --- | --- |
| `AGENT_IDENTITY_REGISTRY__BASE_URL` | The registry's URL. Required. |
| `VERIFY_WALLET_OWNERSHIP__ORCHESTRATOR_FRONT_BASE_URL` | The web console's public URL. `/verify-wallet-ownership` links to its `/verify-wallet` page. Required. |
| `IPFS_GATEWAY__URL_TEMPLATE` | Gateway for agent images. Default `https://ipfs.io/ipfs/%s`. |
| `CACHE__SLACK_USER_SYNCHRONIZER_TTL_MINUTES`, `CACHE__SLACK_CHANNEL_SYNCHRONIZER_TTL_MINUTES` | How long Slack users and channels stay cached. Default 60. |

A host doesn't start if it can't reach the broker.

## 3. Connect the gateway

Point the gateway at the internal host, so `/verify-wallet-ownership` can finish:

```bash
PLATFORM_BRIDGES__SLACK_BRIDGE__BASE_URL=http://slack-bridge-internal:3000
```

## 4. Check it works

1. Create a public channel whose name starts with the prefix, such as `ai-claims`. The bot joins it. For a private channel, invite the bot.
2. Run `/add-agent <collection address> <token ID>` with a facilitator, then with an expert.
3. Post a message. The facilitator should reply in the thread.

Slash commands always answer Slack with HTTP `200` and a message only the caller sees, such as `Agent added to channel successfully`. A wrong number of arguments gives `Invalid command format, expected: ...` with the expected arguments. Any other failure gives `Failed to handle command`: check the external host's logs for the cause.

## Update the manifest

Paste the new manifest under **App Manifest** and save. If the scopes changed, reinstall the app from **Install App**. The bot token usually stays the same, so the bridge needs no change.

Use one Slack app per environment, such as one for Amoy and one for Polygon, each pointing at its own external host.

## Common mistakes

| Symptom | Fix |
| --- | --- |
| A slash command returns 404 | Its URL must use the `/command-handler/...` path from the manifest, on the external host. |
| Slack can't verify the event URL | Use `/event-handler` on the external host, and check the host is running. |
| Replies never reach Slack | `CONVERSATION_BROKER__CALLBACK_URL` must point at the internal host, reachable from the broker. |
| Wallet verification fails at the last step | The gateway's `PLATFORM_BRIDGES__SLACK_BRIDGE__BASE_URL` must point at the internal host. |
| No messages from private channels | Invite the bot, and keep `message.groups` in `bot_events`. |
| New scopes don't apply | Reinstall the app after changing scopes. |
| URLs contain `<` or `>` | Replace the whole placeholder, brackets included. |
