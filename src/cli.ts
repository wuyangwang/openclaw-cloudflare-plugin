import type { OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { probeCloudflare } from './probe.js';
import type { Command } from 'commander';
import { PLUGIN_NAME } from './config.js';

export function registerCloudflareCli(
    api: OpenClawPluginApi,
    program: Command,
) {
    const cf = program
        .command('cloudflare')
        .description('Cloudflare plugin management');

    cf.command('login')
        .description('Save Cloudflare API Token to configuration')
        .option('--token <token>', 'Cloudflare API Token')
        // .option('--account <id>', 'Cloudflare Account ID (optional)')
        .action(async (options: any) => {
            const token = options.token;
            if (!token || token.trim() === '') {
                api.logger.error('please input token.');
                return;
            }

            const probe = await probeCloudflare(token.trim(), options.account);
            if (!probe.ok) {
                api.logger.error(`❌ Error: ${probe.error}`);
                return;
            }
            api.logger.info(
                `✅ Token is active. Auto-detected Account ID: ${probe.accountId}`,
            );

            if (!options.account) {
                //
            }

            const currentConfig = await api.runtime.config.loadConfig();
            const nextConfig = {
                ...currentConfig,
                plugins: {
                    ...currentConfig.plugins,
                    entries: {
                        ...currentConfig.plugins?.entries,
                        [PLUGIN_NAME]: {
                            enabled: true,
                            config: {
                                ...(currentConfig.plugins?.entries?.[PLUGIN_NAME]?.config || {}),
                                apiToken: token.trim(),
                                accountId: probe.accountId?.trim() || undefined,
                            },
                        },
                    },
                },
            };

            await api.runtime.config.writeConfigFile(nextConfig);
            api.logger.info('✅ Cloudflare configuration has been saved.');
        });

    cf.command('status')
        .description('Check Cloudflare configuration status')
        .action(async () => {
            const config = api.runtime.config.loadConfig();
            const cfg = config.plugins?.entries?.[PLUGIN_NAME]?.config as {
                apiToken: string | undefined;
                accountId: string | undefined;
            };
            if (!cfg || !cfg.apiToken) {
                api.logger.error(
                    "❌ Cloudflare is not configured. Run 'openclaw cloudflare login' first.",
                );
                return;
            }

            const probe = await probeCloudflare(cfg.apiToken);
            if (probe.ok) {
                api.logger.info('✅ Cloudflare is configured and active.');
                api.logger.info(`   Account ID: ${probe.accountId}`);
            } else {
                api.logger.error(
                    `❌ Cloudflare configuration error: ${probe.error}`,
                );
            }
        });
}
