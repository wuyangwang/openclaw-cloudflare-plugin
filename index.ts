import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { registerCloudflareCli } from './src/cli.js';
import { registerCloudflareKvTools } from './src/tools/kv.js';
import { registerCloudflareD1Tools } from './src/tools/d1.js';
import { registerCloudflareWorkersTools } from './src/tools/workers.js';
import { registerCloudflareR2Tools } from './src/tools/r2.js';

const plugin = {
    id: 'openclaw-cloudflare-plugin',
    name: 'openclaw-cloudflare-plugin',
    description: 'Cloudflare wrapper for OpenClaw (KV, D1, Workers, R2)',
    register(api: OpenClawPluginApi) {
        // Register tools
        registerCloudflareKvTools(api);
        registerCloudflareD1Tools(api);
        registerCloudflareWorkersTools(api);
        registerCloudflareR2Tools(api);

        // Register CLI commands for management
        api.registerCli(
            ({ program }: any) => {
                registerCloudflareCli(api, program);
            },
            { commands: ['cloudflare'] },
        );
    },
};

export default plugin;
