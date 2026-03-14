import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { Type } from 'typebox';
import { getCloudflareClient, getOrResolveAccountId } from './client.js';
import { PLUGIN_NAME } from './config.js';

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

// ============ Helpers ============

function json(data: unknown) {
    return {
        content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
        ],
        details: data,
    };
}

// ============ Tool Registration ============

export function registerCloudflareKvTools(api: OpenClawPluginApi) {
    const getClientAndAccount = async () => {
        const config = api.config.plugins?.entries?.[PLUGIN_NAME]?.config as any;
        const { apiToken, accountId: configuredAccountId } = config || {};
        if (!apiToken) {
            api.logger.error?.('Cloudflare apiToken not configured');
            throw new Error('Cloudflare apiToken not configured');
        }

        const client = getCloudflareClient(apiToken);
        const accountId = await getOrResolveAccountId(
            client,
            configuredAccountId,
        );
        return { client, accountId };
    };

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
                    const { client, accountId } = await getClientAndAccount();
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

    // 2. List Keys
    api.registerTool(
        {
            name: 'cloudflare_kv_list_keys',
            label: 'Cloudflare List KV Keys',
            description: 'List keys in a specific Cloudflare KV namespace',
            parameters: ListKvKeysSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } = await getClientAndAccount();
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

    // 3. Get Key Value
    api.registerTool(
        {
            name: 'cloudflare_kv_get_value',
            label: 'Cloudflare Get KV Value',
            description:
                'Get the value of a specific key in a Cloudflare KV namespace',
            parameters: GetKvValueSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } = await getClientAndAccount();
                    const res = await client.kv.namespaces.values.get(
                        params.namespace_id,
                        params.key,
                        {
                            account_id: accountId,
                        },
                    );

                    // SDK might return a Response object or string depending on version/config
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

    api.logger.info?.('Cloudflare tools registered');
}
