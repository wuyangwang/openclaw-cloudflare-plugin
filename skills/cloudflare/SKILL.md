---
name: cloudflare
description: |
  Comprehensive Cloudflare resource management including KV, D1, Workers, and R2. Use this skill to manage storage, databases, scripts, and buckets.
---

# Cloudflare Management Tool

Manage your Cloudflare resources (KV, D1, Workers, R2) through these tools.

> ⚠️ **Caution**: Sensitive operations like `create`, `update`, and `delete` should be used with extreme care. It is not recommended to use these in production environments.

## KV (Key-Value Storage)

### Actions
- **List Namespaces**: `cloudflare_kv_list_namespaces { "page": 1, "per_page": 10 }`
- **Create Namespace**: `cloudflare_kv_create_namespace { "name": "new_namespace" }`
- **Delete Namespace**: `cloudflare_kv_delete_namespace { "namespace_id": "id" }`
- **List Keys**: `cloudflare_kv_list_keys { "namespace_id": "id", "limit": 10 }`
- **Get Value**: `cloudflare_kv_get_value { "namespace_id": "id", "key": "key" }`
- **Put Value**: `cloudflare_kv_put_value { "namespace_id": "id", "key": "key", "value": "value" }`
- **Delete Key**: `cloudflare_kv_delete_key { "namespace_id": "id", "key": "key" }`

## D1 (SQL Database)

### Actions
- **List Databases**: `cloudflare_d1_list_databases { "page": 1, "per_page": 10 }`
- **Create Database**: `cloudflare_d1_create_database { "name": "new_db" }`
- **Get Database**: `cloudflare_d1_get_database { "database_id": "id" }`
- **Delete Database**: `cloudflare_d1_delete_database { "database_id": "id" }`
- **Query Database**: `cloudflare_d1_query_database { "database_id": "id", "sql": "SELECT * FROM table" }`

## Workers (Serverless Compute)

### Actions
- **List Workers**: `cloudflare_workers_list { "page": 1, "per_page": 10 }`
- **Get Worker**: `cloudflare_workers_get { "worker_id": "name" }`
- **Create Worker**: `cloudflare_workers_create { "name": "name", "params": { "usage_model": "standard" } }`
- **Update Worker**: `cloudflare_workers_update { "worker_id": "name", "params": { "usage_model": "bundled" } }`
- **Edit Worker**: `cloudflare_workers_edit { "worker_id": "name", "params": { "description": "My worker" } }`
- **Delete Worker**: `cloudflare_workers_delete { "worker_id": "name" }`

## R2 (Object Storage)

### Actions
- **List Buckets**: `cloudflare_r2_list_buckets { "per_page": 10 }`
- **Create Bucket**: `cloudflare_r2_create_bucket { "name": "new_bucket" }`
- **Get Bucket**: `cloudflare_r2_get_bucket { "bucket_name": "name" }`
- **Delete Bucket**: `cloudflare_r2_delete_bucket { "bucket_name": "name" }`

## Common Workflow
1. **Discovery**: Use `list` tools to find IDs or names of resources.
2. **Investigation**: Use `get` or `query` tools to inspect content.
3. **Modification**: Use `put`, `update`, or `create` for changes (use with caution).
4. **Cleanup**: Use `delete` tools to remove resources (use with caution).
