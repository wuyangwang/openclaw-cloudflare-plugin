import Cloudflare from 'cloudflare';

let clientCache: Cloudflare | null = null;
let lastApiToken: string | null = null;
let resolvedAccountId: string | null = null;

export function getCloudflareClient(apiToken: string): Cloudflare {
    if (clientCache && lastApiToken === apiToken) {
        return clientCache;
    }

    clientCache = new Cloudflare({
        apiToken: apiToken,
    });
    lastApiToken = apiToken;
    resolvedAccountId = null; // Reset account ID when token changes
    return clientCache;
}

export async function getOrResolveAccountId(
    client: Cloudflare,
    configuredAccountId?: string,
): Promise<string> {
    if (configuredAccountId) {
        return configuredAccountId;
    }

    if (resolvedAccountId) {
        return resolvedAccountId;
    }

    const accounts = await client.accounts.list();
    const firstAccount = accounts.result?.[0];

    if (!firstAccount?.id) {
        throw new Error('No Cloudflare accounts found for this token.');
    }

    resolvedAccountId = firstAccount.id;
    return resolvedAccountId;
}
