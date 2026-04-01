import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { Type } from 'typebox';
import { getClientAndAccount, json } from './utils.js';

// ============ Schemas ============

const ListWorkersSchema = Type.Object({
    page: Type.Optional(Type.Number({ description: 'Page number' })),
    per_page: Type.Optional(
        Type.Number({ description: 'Number of workers per page' }),
    ),
});

const WorkerIdSchema = Type.Object({
    worker_id: Type.String({ description: 'The name or ID of the Worker' }),
});

const CreateWorkerSchema = Type.Object({
    name: Type.String({ description: 'The name of the Worker' }),
    params: Type.Optional(
        Type.Any({
            description: 'Additional parameters for creating the worker',
        }),
    ),
});

const UpdateWorkerSchema = Type.Object({
    worker_id: Type.String({ description: 'The name or ID of the Worker' }),
    params: Type.Any({ description: 'Parameters to update the worker' }),
});

const EditWorkerSchema = Type.Object({
    worker_id: Type.String({ description: 'The name or ID of the Worker' }),
    params: Type.Any({ description: 'Parameters to edit the worker' }),
});

// ============ Tool Registration ============

export function registerCloudflareWorkersTools(api: OpenClawPluginApi) {
    // 1. List Workers
    api.registerTool(
        {
            name: 'cloudflare_workers_list',
            label: 'Cloudflare List Workers',
            description: 'List all Workers in the configured account',
            parameters: ListWorkersSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.list({
                        account_id: accountId,
                        ...params,
                    });
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_workers_list' },
    );

    // 2. Get Worker
    api.registerTool(
        {
            name: 'cloudflare_workers_get',
            label: 'Cloudflare Get Worker',
            description: 'Get metadata of a specific Cloudflare Worker',
            parameters: WorkerIdSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.get(
                        params.worker_id,
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
        { name: 'cloudflare_workers_get' },
    );

    // 3. Create Worker
    api.registerTool(
        {
            name: 'cloudflare_workers_create',
            label: 'Cloudflare Create Worker',
            description: 'Create a new Cloudflare Worker',
            parameters: CreateWorkerSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.create({
                        account_id: accountId,
                        name: params.name,
                        ...params.params,
                    });
                    return json(result);
                } catch (err) {
                    return json({
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            },
        },
        { name: 'cloudflare_workers_create' },
    );

    // 4. Update Worker
    api.registerTool(
        {
            name: 'cloudflare_workers_update',
            label: 'Cloudflare Update Worker',
            description: 'Update a Cloudflare Worker configuration',
            parameters: UpdateWorkerSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.update(
                        params.worker_id,
                        {
                            account_id: accountId,
                            ...params.params,
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
        { name: 'cloudflare_workers_update' },
    );

    // 5. Edit Worker
    api.registerTool(
        {
            name: 'cloudflare_workers_edit',
            label: 'Cloudflare Edit Worker',
            description: 'Edit a Cloudflare Worker configuration',
            parameters: EditWorkerSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.edit(
                        params.worker_id,
                        {
                            account_id: accountId,
                            ...params.params,
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
        { name: 'cloudflare_workers_edit' },
    );

    // 6. Delete Worker
    api.registerTool(
        {
            name: 'cloudflare_workers_delete',
            label: 'Cloudflare Delete Worker',
            description: 'Delete a Cloudflare Worker',
            parameters: WorkerIdSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.workers.beta.workers.delete(
                        params.worker_id,
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
        { name: 'cloudflare_workers_delete' },
    );
}
