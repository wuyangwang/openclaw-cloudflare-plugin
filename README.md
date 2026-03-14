# openclaw-cloudflare-plugin

![npm version](https://img.shields.io/npm/v/openclaw-cloudflare-plugin)
![npm downloads](https://img.shields.io/npm/dm/openclaw-cloudflare-plugin)
![license](https://img.shields.io/npm/l/openclaw-cloudflare-plugin)
![typescript](https://img.shields.io/badge/TypeScript-supported-blue)
![GitHub stars](https://img.shields.io/github/stars/wuyangwang/openclaw-cloudflare-plugin)

Cloudflare API wrapper plugin for **OpenClaw**, built on the Cloudflare TypeScript SDK.

This plugin allows OpenClaw to interact with your Cloudflare account via chat commands.

## Features (Current)

Currently supported:

* **KV**

  * List KV namespaces

> More features such as D1 and Workers management will be added in the future.

---

# Installation

You need a **Cloudflare API Token** before installing.

Create one here:
https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

---

## Step 1 — Install Plugin

```bash
openclaw install openclaw-cloudflare-plugin
```

---

## Step 2 — Login with Cloudflare Token

```bash
openclaw cloudflare login --token <YOUR_API_TOKEN>
```

Example:

```bash
openclaw cloudflare login --token abc123
```

---

## Step 3 — Verify Login (Optional)

```bash
openclaw cloudflare status
```

---

# Usage

1. Configure a **chat channel** supported by OpenClaw
   Examples:

* Discord
* Telegram
* Wecom Bot (企业微信机器人)

2. Send a command in your chat channel

Example:

```
Please show my Cloudflare KV list
And:
Get top 5 keys in first namespace
```

3. OpenClaw will query Cloudflare and return your KV namespaces.

---

# Roadmap

Planned features:

* KV CRUD
* D1 database operations
* Workers management

---

# License

MIT
