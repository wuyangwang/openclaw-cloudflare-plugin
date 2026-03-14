import { getCloudflareClient, getOrResolveAccountId } from './client.js';

export type CloudflareProbeResult = {
    ok: boolean;
    error?: string;
    accountId?: string;
};

export async function probeCloudflare(
    apiToken: string,
    configuredAccountId?: string,
): Promise<CloudflareProbeResult> {
    if (!apiToken) {
        return { ok: false, error: 'Missing API Token' };
    }

    try {
        const client = getCloudflareClient(apiToken);

        // 1. Verify Token
        const verify = await client.user.tokens.verify();
        if (verify.status !== 'active') {
            return { ok: false, error: `Token status: ${verify.status}` };
        }

        // 2. Try to resolve account ID to ensure token has account access
        const accountId = await getOrResolveAccountId(
            client,
            configuredAccountId,
        );

        return { ok: true, accountId };
    } catch (err) {
        return {
            ok: false,
            error: err instanceof Error ? err.message : String(err),
        };
    }
}
