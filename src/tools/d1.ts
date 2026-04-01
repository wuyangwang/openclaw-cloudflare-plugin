import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { Type } from 'typebox';
import { getClientAndAccount, json } from './utils.js';

// ============ Schemas ============

const ListD1DatabasesSchema = Type.Object({
    name: Type.Optional(
        Type.String({ description: 'Filter by database name' }),
    ),
    page: Type.Optional(
        Type.Number({ description: 'Page number', default: 1 }),
    ),
    per_page: Type.Optional(
        Type.Number({ description: 'Items per page', default: 10 }),
    ),
});

const CreateD1DatabaseSchema = Type.Object({
    name: Type.String({ description: 'The name of the new database' }),
});

const GetD1DatabaseSchema = Type.Object({
    database_id: Type.String({ description: 'Cloudflare D1 Database ID' }),
});

const DeleteD1DatabaseSchema = Type.Object({
    database_id: Type.String({ description: 'Cloudflare D1 Database ID' }),
});

const QueryD1DatabaseSchema = Type.Object({
    database_id: Type.String({ description: 'Cloudflare D1 Database ID' }),
    sql: Type.String({ description: 'The SQL statement to execute' }),
    params: Type.Optional(
        Type.Array(Type.Any(), {
            description: 'Parameters for the SQL statement',
        }),
    ),
});

// ============ Tool Registration ============

export function registerCloudflareD1Tools(api: OpenClawPluginApi) {
    // 1. List Databases
    api.registerTool(
        {
            name: 'cloudflare_d1_list_databases',
            label: 'Cloudflare List D1 Databases',
            description: 'List D1 databases in the configured account',
            parameters: ListD1DatabasesSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.d1.database.list({
                        account_id: accountId,
                        name: params.name,
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
        { name: 'cloudflare_d1_list_databases' },
    );

    // 2. Create Database
    api.registerTool(
        {
            name: 'cloudflare_d1_create_database',
            label: 'Cloudflare Create D1 Database',
            description: 'Create a new D1 database',
            parameters: CreateD1DatabaseSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.d1.database.create({
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
        { name: 'cloudflare_d1_create_database' },
    );

    // 3. Get Database
    api.registerTool(
        {
            name: 'cloudflare_d1_get_database',
            label: 'Cloudflare Get D1 Database',
            description: 'Get details about a specific D1 database',
            parameters: GetD1DatabaseSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.d1.database.get(
                        params.database_id,
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
        { name: 'cloudflare_d1_get_database' },
    );

    // 4. Delete Database
    api.registerTool(
        {
            name: 'cloudflare_d1_delete_database',
            label: 'Cloudflare Delete D1 Database',
            description: 'Delete a D1 database',
            parameters: DeleteD1DatabaseSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.d1.database.delete(
                        params.database_id,
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
        { name: 'cloudflare_d1_delete_database' },
    );

    // 5. Query Database
    api.registerTool(
        {
            name: 'cloudflare_d1_query_database',
            label: 'Cloudflare Query D1 Database',
            description: 'Execute a SQL query against a D1 database',
            parameters: QueryD1DatabaseSchema,
            async execute(_toolCallId, params: any) {
                try {
                    const { client, accountId } =
                        await getClientAndAccount(api);
                    const result = await client.d1.database.raw(
                        params.database_id,
                        {
                            account_id: accountId,
                            sql: params.sql,
                            params: params.params,
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
        { name: 'cloudflare_d1_query_database' },
    );
}
