---
title: Health
sidebar_position: 6
description: Gateway endpoint to check that the gateway answers.
---

# Health

## Ping

`GET /ping` · Public

Answers as long as the gateway runs. It doesn't check the services behind it.

Response `200`: `pong` as plain text.
