#!/usr/bin/env node
import { cac } from 'cac';
import { version } from './package.json';
import { getCloudflareClient, getOrResolveAccountId } from './src/client.js';
import { probeCloudflare } from './src/probe.js';

const cli = cac('cf');

// Global options
cli.option('--token <token>', 'Cloudflare API Token');
cli.option('--account <id>', 'Cloudflare Account ID');

function getOptions(options: any) {
    const apiToken = options.token || process.env.CLOUDFLARE_API_TOKEN;
    const accountId = options.account || process.env.CLOUDFLARE_ACCOUNT_ID;
    if (!apiToken) {
        console.error(
            'Error: Cloudflare API Token is required (use --token or CLOUDFLARE_API_TOKEN env)',
        );
        process.exit(1);
    }
    return { apiToken, accountId };
}

cli.command('status', 'Check Cloudflare connection status').action(
    async (options) => {
        const { apiToken, accountId } = getOptions(options);
        console.log('Checking Cloudflare status...');
        const result = await probeCloudflare(apiToken, accountId);
        if (result.ok) {
            console.log('✅ Connection successful!');
            console.log(`Account ID: ${result.accountId}`);
        } else {
            console.error(`❌ Connection failed: ${result.error}`);
            process.exit(1);
        }
    },
);

cli.command('kv:list', 'List KV namespaces').action(async (options) => {
    const { apiToken, accountId: cfgAccountId } = getOptions(options);
    try {
        const client = getCloudflareClient(apiToken);
        const accountId = await getOrResolveAccountId(client, cfgAccountId);
        const namespaces = await client.kv.namespaces.list({
            account_id: accountId,
        });
        console.table(
            namespaces.result.map((ns) => ({ id: ns.id, title: ns.title })),
        );
    } catch (err) {
        console.error(
            `Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        process.exit(1);
    }
});

cli.command('kv:get <namespace_id> <key>', 'Get KV value').action(
    async (namespaceId, key, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            const res = await client.kv.namespaces.values.get(
                namespaceId,
                key,
                {
                    account_id: accountId,
                },
            );
            const value =
                typeof res === 'string' ? res : await (res as any).text();
            console.log(value);
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.command('workers:list', 'List Workers').action(async (options) => {
    const { apiToken, accountId: cfgAccountId } = getOptions(options);
    try {
        const client = getCloudflareClient(apiToken);
        const accountId = await getOrResolveAccountId(client, cfgAccountId);
        const workers = await (client.workers as any).beta.workers.list({
            account_id: accountId,
        });
        console.table(
            workers.result.map((w: any) => ({ id: w.id, name: w.name })),
        );
    } catch (err) {
        console.error(
            `Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        process.exit(1);
    }
});

cli.command('workers:get <worker_id>', 'Get Worker details').action(
    async (workerId, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            const worker = await (client.workers as any).beta.workers.get(
                workerId,
                {
                    account_id: accountId,
                },
            );
            console.log(JSON.stringify(worker, null, 2));
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.command('workers:create <name>', 'Create a Worker').action(
    async (name, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            const result = await (client.workers as any).beta.workers.create({
                account_id: accountId,
                name,
            });
            console.log(`✅ Worker ${name} created.`);
            console.log(JSON.stringify(result.result, null, 2));
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.command('workers:update <worker_id> <name>', 'Update a Worker name').action(
    async (workerId, name, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            const result = await (client.workers as any).beta.workers.update(
                workerId,
                {
                    account_id: accountId,
                    name,
                },
            );
            console.log(`✅ Worker ${workerId} updated.`);
            console.log(JSON.stringify(result.result, null, 2));
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.command('workers:delete <worker_id>', 'Delete Worker').action(
    async (workerId, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            await (client.workers as any).beta.workers.delete(workerId, {
                account_id: accountId,
            });
            console.log(`✅ Worker ${workerId} deleted.`);
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.command('d1:list', 'List D1 databases').action(async (options) => {
    const { apiToken, accountId: cfgAccountId } = getOptions(options);
    try {
        const client = getCloudflareClient(apiToken);
        const accountId = await getOrResolveAccountId(client, cfgAccountId);
        const databases = await client.d1.database.list({
            account_id: accountId,
        });
        console.table(
            databases.result.map((db) => ({ uuid: db.uuid, name: db.name })),
        );
    } catch (err) {
        console.error(
            `Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        process.exit(1);
    }
});

cli.command('d1:get <database_id>', 'Get D1 database details').action(
    async (databaseId, options) => {
        const { apiToken, accountId: cfgAccountId } = getOptions(options);
        try {
            const client = getCloudflareClient(apiToken);
            const accountId = await getOrResolveAccountId(client, cfgAccountId);
            const database = await client.d1.database.get(databaseId, {
                account_id: accountId,
            });
            console.log(JSON.stringify(database, null, 2));
        } catch (err) {
            console.error(
                `Error: ${err instanceof Error ? err.message : String(err)}`,
            );
            process.exit(1);
        }
    },
);

cli.help();
cli.version(version);

const parsed = cli.parse();

if (!cli.matchedCommand && !parsed.options.help && !parsed.options.version) {
    cli.outputHelp();
}
