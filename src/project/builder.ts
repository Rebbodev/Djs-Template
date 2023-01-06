import { cmdHandler } from '../components/cmdHandler';
import { logger } from '../util/clients/logger';


export const build = async () => {
    logger.startup('Building the project...');

    process.on('unhandledRejection', (reason, promise) => {
        console.log(reason, promise);
    });

    process.on('uncaughtException', (reason, promise) => {
        console.log(reason, promise);
    });

    await cmdHandler.on();
    
    logger.startup('Successfully built the project!');
};