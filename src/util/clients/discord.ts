import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { presence } from '../../data/json/config.json';
import { logger } from './logger';
const { text, url } = presence;

logger.startup('Creating discord client...');
export const botClient = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [
            {
                name: text,
                type: ActivityType.Playing,
                url: url
            }
        ]
    }
});
logger.startup('Discord client created!');
