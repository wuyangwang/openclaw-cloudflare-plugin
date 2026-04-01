import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { Type } from 'typebox';
import { getClientAndAccount, json } from './utils.js';

// ============ Schemas ============

const ListR2BucketsSchema = Type.Object({
    name_contains: Type.Optional(
        Type.String({ description: 'Filter by name containing string' }),
    ),
    start_after: Type.Optional(
        Type.String({ description: 'Pagination cursor' }),
    ),
    per_page: Type.Optional(
        Type.Number({ description: 'Items per page', default: 10 }),
    ),
    order: Type.Optional(
        Type.String({ description: 'Order by field', enum: ['name'] }),
    ),
    direction: Type.Optional(
        Type.String({ description: 'Sort direction', enum: ['asc', 'desc'] }),
    ),
});

const CreateR2BucketSchema = Type.Object({
    name: Type.String({ description: 'The name of the new bucket' }),
});

const GetR2BucketSchema = Type.Object({
    bucket_name: Type.String({ description: 'The name of the bucket' }),
});

const DeleteR2BucketSchema = Type.Object({
    bucket_name: Type.String({ description: 'The name of the bucket' }),
});

// ============ Tool Registration ============

export function registerCloudflareR2Tools(api: OpenClawPluginApi) {
    // 1. List Buckets
    api.registerTool(
        {
            name: 'cloudflare_r2_list_buckets',
            label: 'Cloudflare List R2 Buckets',
            description: 'List all R2 buckets in the configured account',
            parameters: ListR2BucketsSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.r2.buckets.list({
                        account_id: accountId,
                        name_contains: params.name_contains,
                        start_after: params.start_after,
                        per_page: params.per_page,
                        order: params.order,
                        direction: params.direction,
                    });
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_r2_list_buckets' },
    );

    // 2. Create Bucket
    api.registerTool(
        {
            name: 'cloudflare_r2_create_bucket',
            label: 'Cloudflare Create R2 Bucket',
            description: 'Create a new R2 bucket',
            parameters: CreateR2BucketSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.r2.buckets.create({
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
        { name: 'cloudflare_r2_create_bucket' },
    );

    // 3. Get Bucket
    api.registerTool(
        {
            name: 'cloudflare_r2_get_bucket',
            label: 'Cloudflare Get R2 Bucket',
            description: 'Get details about a specific R2 bucket',
            parameters: GetR2BucketSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.r2.buckets.get(
                        params.bucket_name,
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
        { name: 'cloudflare_r2_get_bucket' },
    );

    // 4. Delete Bucket
    api.registerTool(
        {
            name: 'cloudflare_r2_delete_bucket',
            label: 'Cloudflare Delete R2 Bucket',
            description: 'Delete an R2 bucket',
            parameters: DeleteR2BucketSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.r2.buckets.delete(
                        params.bucket_name,
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
        { name: 'cloudflare_r2_delete_bucket' },
    );
}
