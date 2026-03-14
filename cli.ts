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

cli.help();
cli.version(version);

const parsed = cli.parse();

if (!cli.matchedCommand && !parsed.options.help && !parsed.options.version) {
    cli.outputHelp();
}
