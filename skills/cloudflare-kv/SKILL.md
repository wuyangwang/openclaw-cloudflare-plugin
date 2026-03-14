---
name: cloudflare-kv
description: |
  Cloudflare KV (Key-Value) storage management. Use this skill to list namespaces, keys, and retrieve values from Cloudflare.
---

# Cloudflare KV Tool

Use the following tools to manage Cloudflare KV storage.

## Actions

### List Namespaces
List all available KV namespaces. Use this to find the `namespace_id` for other tools.
`cloudflare_kv_list_namespaces { "page": 1, "per_page": 20 }`

### List Keys
List keys within a specific namespace.
`cloudflare_kv_list_keys { "namespace_id": "YOUR_NAMESPACE_ID", "limit": 10 }`

### Get Value
Retrieve the text value of a specific key.
`cloudflare_kv_get_value { "namespace_id": "YOUR_NAMESPACE_ID", "key": "YOUR_KEY" }`

## Common Workflow
1. If the user doesn't specify a namespace, call `cloudflare_kv_list_namespaces` first.
2. If the user wants to see "cache" or "entries", call `cloudflare_kv_list_keys` with the target `namespace_id`.
3. To show content, call `cloudflare_kv_get_value`.
