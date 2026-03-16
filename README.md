# openclaw-cloudflare-plugin

![npm version](https://img.shields.io/npm/v/openclaw-cloudflare-plugin)
![npm downloads](https://img.shields.io/npm/dm/openclaw-cloudflare-plugin)
![license](https://img.shields.io/npm/l/openclaw-cloudflare-plugin)
![typescript](https://img.shields.io/badge/TypeScript-supported-blue)
![GitHub stars](https://img.shields.io/github/stars/wuyangwang/openclaw-cloudflare-plugin)

Cloudflare API wrapper plugin for **OpenClaw**, built on the Cloudflare TypeScript SDK.

This plugin allows OpenClaw to interact with your Cloudflare account via chat commands.

> ⚠️ **警告 / Warning**: 删除/添加等敏感操作请谨慎使用，不建议在正式环境使用。
> Please use sensitive operations like delete/add with caution. It is not recommended for use in production environments.

## Features (Current)

Currently supported:

* **KV (Full CRUD)**
  * List namespaces, create/delete namespaces
  * List keys, get/put/delete key-value pairs
* **D1 (Full CRUD)**
  * List/create/get/delete databases
  * Execute raw SQL queries
* **Workers (Serverless Compute)**
  * List deployed Workers
  * Get Worker code
  * Deploy or update Workers (serverless deployment)
  * Delete Workers
* **R2 (Full CRUD)**
  * List/create/get/delete buckets

---

# Installation

You need a **Cloudflare API Token** before installing.

Create one here:
https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

---

## Step 1 — Install Plugin

```bash
openclaw plugins install openclaw-cloudflare-plugin
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

3. OpenClaw will query Cloudflare and return your results.

---

# License

MIT
