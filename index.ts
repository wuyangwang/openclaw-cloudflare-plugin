import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { registerCloudflareCli } from './src/cli.js';
import { registerCloudflareKvTools } from './src/kv.js';
// import { probeCloudflare } from './src/probe.js';

const plugin = {
    id: 'openclaw-cloudflare-plugin',
    name: 'openclaw-cloudflare-plugin',
    description: 'Cloudflare wrapper for OpenClaw (KV, Workers, etc.)',
    // status: {
    //     probeAccount: async ({ config }: any) => {
    //         // Direct access to the plugin's own config
    //         return await probeCloudflare(config?.apiToken, config?.accountId);
    //     },
    // },
    register(api: OpenClawPluginApi) {
        // Register tools (they will read from api.pluginConfig)
        registerCloudflareKvTools(api);

        // Register CLI commands for management
        api.registerCli(({ program }: any) => {
            registerCloudflareCli(api, program);
        });
    },
};

export default plugin;
