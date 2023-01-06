import { config } from 'dotenv';
import { botClient } from './util/clients/discord';
import { logger } from './util/clients/logger';
import { build } from './project/builder';

config();
logger.startup('Requesting application access...');
(async () => {
    await botClient.login(process.env.BOT_TOKEN).catch(() => {
        logger.error('The access token provided is invalid!');
    });

    logger.startup('Application access granted!');

    await build();
})();