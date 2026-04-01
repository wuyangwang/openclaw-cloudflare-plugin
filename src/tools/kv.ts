import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { Type } from 'typebox';
import { getClientAndAccount, json } from './utils.js';

// ============ Schemas ============

const ListKvNamespacesSchema = Type.Object({
    page: Type.Optional(
        Type.Number({
            description: 'Page number of paginated results',
            default: 1,
        }),
    ),
    per_page: Type.Optional(
        Type.Number({
            description: 'Number of namespaces per page',
            default: 10,
            maximum: 50,
        }),
    ),
});

const CreateKvNamespaceSchema = Type.Object({
    name: Type.String({ description: 'The name of the new namespace' }),
});

const DeleteKvNamespaceSchema = Type.Object({
    namespace_id: Type.String({ description: 'Cloudflare KV Namespace ID' }),
});

const ListKvKeysSchema = Type.Object({
    namespace_id: Type.String({ description: 'Cloudflare KV Namespace ID' }),
    limit: Type.Optional(
        Type.Number({
            description: 'Maximum number of keys to return',
            default: 10,
            maximum: 50,
        }),
    ),
    prefix: Type.Optional(
        Type.String({ description: 'Filter keys by prefix' }),
    ),
    cursor: Type.Optional(Type.String({ description: 'Pagination cursor' })),
});

const GetKvValueSchema = Type.Object({
    namespace_id: Type.String({ description: 'Cloudflare KV Namespace ID' }),
    key: Type.String({ description: 'Key name' }),
});

const PutKvValueSchema = Type.Object({
    namespace_id: Type.String({ description: 'Cloudflare KV Namespace ID' }),
    key: Type.String({ description: 'Key name' }),
    value: Type.String({ description: 'The value to store' }),
    expiration: Type.Optional(
        Type.Number({ description: 'Expiration time in seconds since epoch' }),
    ),
    expiration_ttl: Type.Optional(
        Type.Number({ description: 'Time to live in seconds' }),
    ),
    metadata: Type.Optional(
        Type.String({
            description: 'Metadata to store with the value (JSON string)',
        }),
    ),
});

const DeleteKvKeySchema = Type.Object({
    namespace_id: Type.String({ description: 'Cloudflare KV Namespace ID' }),
    key: Type.String({ description: 'Key name' }),
});

// ============ Tool Registration ============

export function registerCloudflareKvTools(api: OpenClawPluginApi) {
    // 1. List Namespaces
    api.registerTool(
        {
            name: 'cloudflare_kv_list_namespaces',
            label: 'Cloudflare List KV Namespaces',
            description:
                'List all KV namespaces in the configured Cloudflare account',
            parameters: ListKvNamespacesSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.kv.namespaces.list({
                        account_id: accountId,
                        page: params.page,
                        per_page: params.per_page,
                    });
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_list_namespaces' },
    );

    // 2. Create Namespace
    api.registerTool(
        {
            name: 'cloudflare_kv_create_namespace',
            label: 'Cloudflare Create KV Namespace',
            description: 'Create a new KV namespace',
            parameters: CreateKvNamespaceSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.kv.namespaces.create({
                        account_id: accountId,
                        name: params.name,
                    });
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_create_namespace' },
    );

    // 3. Delete Namespace
    api.registerTool(
        {
            name: 'cloudflare_kv_delete_namespace',
            label: 'Cloudflare Delete KV Namespace',
            description: 'Delete a KV namespace',
            parameters: DeleteKvNamespaceSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.kv.namespaces.delete(
                        params.namespace_id,
                        {
                            account_id: accountId,
                        },
                    );
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_delete_namespace' },
    );

    // 4. List Keys
    api.registerTool(
        {
            name: 'cloudflare_kv_list_keys',
            label: 'Cloudflare List KV Keys',
            description: 'List keys in a specific Cloudflare KV namespace',
            parameters: ListKvKeysSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.kv.namespaces.keys.list(
                        params.namespace_id,
                        {
                            account_id: accountId,
                            limit: params.limit,
                            prefix: params.prefix,
                            cursor: params.cursor,
                        },
                    );
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_list_keys' },
    );

    // 5. Get Key Value
    api.registerTool(
        {
            name: 'cloudflare_kv_get_value',
            label: 'Cloudflare Get KV Value',
            description:
                'Get the value of a specific key in a Cloudflare KV namespace',
            parameters: GetKvValueSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const res = await client.kv.namespaces.values.get(
                        params.namespace_id,
                        params.key,
                        {
                            account_id: accountId,
                        },
                    );

                    const value =
                        typeof res === 'string'
                            ? res
                            : await (res as any).text();
                    return json({ key: params.key, value });
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_get_value' },
    );

    // 6. Put Key Value
    api.registerTool(
        {
            name: 'cloudflare_kv_put_value',
            label: 'Cloudflare Put KV Value',
            description: 'Write a value to a Cloudflare KV namespace',
            parameters: PutKvValueSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const metadata = params.metadata
                        ? JSON.parse(params.metadata)
                        : undefined;
                    const result = await client.kv.namespaces.values.update(
                        params.namespace_id,
                        params.key,
                        {
                            account_id: accountId,
                            value: params.value,
                            expiration: params.expiration,
                            expiration_ttl: params.expiration_ttl,
                            metadata,
                        },
                    );
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_put_value' },
    );

    // 7. Delete Key Value
    api.registerTool(
        {
            name: 'cloudflare_kv_delete_key',
            label: 'Cloudflare Delete KV Key',
            description: 'Delete a key from a Cloudflare KV namespace',
            parameters: DeleteKvKeySchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.kv.namespaces.values.delete(
                        params.namespace_id,
                        params.key,
                        {
                            account_id: accountId,
                        },
                    );
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_kv_delete_key' },
    );
}
