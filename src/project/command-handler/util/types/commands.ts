import { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, Message, PermissionResolvable } from 'discord.js';

export enum CommandTypes {
    Slash = 0,
    Legacy = 1,
    SlashGuild = 2
}

// Main Commands config
type CommandsConfig = {
    requiredRoles?: {roles: string[], adminBypass?: boolean, userBypass?: string[], useAll: boolean},
    cooldown?: {length: number, global: boolean, perServer: boolean}
    devMode?: boolean
    kill?: boolean
}

// Slash Command Type Build
type SlashConfig = {
        recreate: boolean;
}
type SlashGuildConfig = {
    recreate: boolean;
    uniqueGuilds?: string[]
}


type Slash = {
commandType: CommandTypes.Slash
data: ChatInputApplicationCommandData
config: SlashConfig & CommandsConfig
run: (interaction: ChatInputCommandInteraction, client: Client) => Promise<unknown>
}

type SlashGuild = {
    commandType: CommandTypes.SlashGuild
    data: ChatInputApplicationCommandData
    config: SlashGuildConfig & CommandsConfig
    run: (interaction: ChatInputCommandInteraction, client: Client) => Promise<unknown>
    }

// Legacy Command Type Build
type LegacyConfig = {
    permission?: PermissionResolvable[];
}

type Legacy = {
    commandType: CommandTypes.Legacy
    data: {name: string; description: string; category?: string; syntax?: string;}
    config: LegacyConfig & CommandsConfig
    run: (message: Message, client: Client, args: string[]) => Promise<unknown>
}

export type Command = Slash | SlashGuild | Legacy


