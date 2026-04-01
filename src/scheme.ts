import type { OpenClawPluginConfigSchema } from 'openclaw/plugin-sdk';

type Issue = { path: Array<string | number>; message: string };

type SafeParseResult =
    | { success: true; data?: unknown }
    | { success: false; error: { issues: Issue[] } };

function error(message: string): SafeParseResult {
    return { success: false, error: { issues: [{ path: [], message }] } };
}

export function cloudflarePluginConfigSchema(): OpenClawPluginConfigSchema {
    return {
        safeParse(value: unknown): SafeParseResult {
            if (value === undefined) {
                return { success: true, data: undefined };
            }
            if (!value || typeof value !== 'object' || Array.isArray(value)) {
                return error('expected config object');
            }
            const cfg = value as any;
            if (!cfg.apiToken) {
                return error('apiToken is required');
            }
            return { success: true, data: value };
        },
        jsonSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                apiToken: {
                    type: 'string',
                    description: 'Cloudflare API Token',
                },
                accountId: {
                    type: 'string',
                    description:
                        'Cloudflare Account ID (optional, will be auto-detected if omitted)',
                },
            },
            required: ['apiToken'],
        },
    };
}
