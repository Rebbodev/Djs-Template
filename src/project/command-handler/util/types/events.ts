import { ClientEvents } from 'discord.js';

export type discordEvent = {
    event: keyof ClientEvents,
    listener: (...args: unknown[]) => Promise<void>
}