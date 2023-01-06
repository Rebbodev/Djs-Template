import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Command } from './commands';

export type ruleFunc = (action: Message| ChatInputCommandInteraction, command: Command) => Promise<{perm: boolean, reason: string}>