import { Client, Guild } from 'discord.js';
import { logger } from '../../../util/clients/logger';

const Warned = {
    wasWarned: false
};

export const filterGuilds = (guilds: string[], client: Client): Guild[] | undefined => {
    let endGuilds: Guild[] | undefined = [];

    for (const guildId of guilds) {

        const getGuild = client.guilds.cache.get(guildId);

        if (getGuild) endGuilds.push(getGuild);
    }

    if (endGuilds.length === 0) {
        endGuilds = undefined;
        if (!Warned.wasWarned) {
            Warned.wasWarned = true;
            logger.warning('The discord application being used does not have access to the guilds provided!', 'Please check the the guild id\'s provided are valid!');
        }
    }

    return endGuilds;

};