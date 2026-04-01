import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { getCloudflareClient, getOrResolveAccountId } from '../client.js';
import { PLUGIN_NAME } from '../config.js';

export function json(data: unknown) {
    return {
        content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
        ],
        details: data,
    };
}

export async function getClientAndAccount(api: OpenClawPluginApi) {
    const config = api.config.plugins?.entries?.[PLUGIN_NAME]?.config as any;
    const { apiToken, accountId: configuredAccountId } = config || {};
    if (!apiToken) {
        api.logger.error?.('Cloudflare apiToken not configured');
        throw new Error('Cloudflare apiToken not configured');
    }

    const client = getCloudflareClient(apiToken);
    const accountId = await getOrResolveAccountId(client, configuredAccountId);
    return { client, accountId };
}
