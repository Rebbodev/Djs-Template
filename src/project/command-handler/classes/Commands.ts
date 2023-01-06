import { Client } from 'discord.js';
import color from 'colors';
import { Command, CommandTypes } from '../util/types/commands';
import { filterGuilds } from '../functions/filterGuilds';


export class Commands {
    legacyCmds: {[key: string]: Command};
    slashCmds: {[key: string]: Command};
    helpData: {[key: string]: string};

    constructor () {
        this.legacyCmds = {
        };
        this.slashCmds = {
        };
        this.helpData = {
        };
    }

    create = async (
        command: Command,
        client: Client,
        guilds: string[],
        options: {
        legacyCommands: {enabled: boolean, prefix: string, delays: boolean},
        slashCommands: {enabled: boolean, guilds: string[], delays: boolean}
    }
    ) => {

        const { data, commandType, config } = command;
        const { Legacy, Slash, SlashGuild } = CommandTypes;
        const { legacyCommands, slashCommands } = options;

        if (commandType === Legacy && !config.kill && legacyCommands.enabled) {
            this.legacyCmds[data.name] = command;

            const stringBuild = {
                cmdPrefix: legacyCommands.prefix,
                cmdName: data.name,
                cmdSyntax: data.syntax ? ` ${data.syntax}` : '',
                cmdDesc: data.description
            };
            const { cmdPrefix, cmdName, cmdSyntax, cmdDesc } = stringBuild;

            const cmdString = `\`${cmdPrefix}${cmdName} ${cmdSyntax}\`\n${cmdDesc}\n`;

            if (data.category && !this.helpData[data.category]) {
                this.helpData[data.category] = cmdString;
            } else if (data.category) {
                this.helpData[data.category] += cmdString;
            }

            return '';
        }

        if (commandType === Slash && !config.kill && slashCommands.enabled) {

            const commands = await client.application?.commands.fetch();
            const findCmd = commands ? commands.find(x => x.name === data.name) : undefined;

            this.slashCmds[data.name] = command;
            if (!findCmd) {
                await client.application?.commands.create(data);

                return `Created "${color.bold.white(data.name)}" application command!`;
            }
        } else if (commandType === SlashGuild && !config.kill && slashCommands.enabled) {
            const guildArr = filterGuilds(config.uniqueGuilds ? config.uniqueGuilds : guilds, client);

            if (!guildArr) return `Failed to create "${color.bold.white(data.name)} due to lack of access to provided guilds."`;

            let returnString = '';

            for (const guild of guildArr) {
                const commands = await guild.commands.fetch();
                const findCmd = commands.find(x => x.name === data.name);

                this.slashCmds[data.name] = command;
                if (!findCmd) {
                    await guild.commands.create(data);

                    returnString += `Created "${color.bold.white(data.name)}" guild application command in "${color.bold.white(guild.name)}"\n`;
                }
            }

            return returnString;
        }


    };

    delete = async (client: Client, guilds: string[], command?: Command, notInFiles?: {name: string, type: CommandTypes.Slash} | {name: string, type: CommandTypes.SlashGuild, guilds: string[]}) => {

        const { Slash, SlashGuild } = CommandTypes;
        // If the command is not in files

        if (notInFiles) {
            if (notInFiles.type === CommandTypes.Slash) {
                const commands = await client.application?.commands.fetch();
                const findCommand = commands ? commands.find(x => x.name === notInFiles.name) : undefined;

                if (findCommand) {
                    await client.application?.commands.delete(findCommand.id);

                    return `Successfully Removed "${color.bold.white(notInFiles.name)}" application command.`;
                }
            } else if (notInFiles.type === CommandTypes.SlashGuild) {
                const guildArr = filterGuilds(notInFiles.guilds ? notInFiles.guilds : guilds, client);

                if (!guildArr) return `Failed to remove "${color.bold.white(notInFiles.name)} from guilds provided due to lack of access."`;

                let returnString = '';

                for (const guild of guildArr) {
                    const commands = await guild.commands.fetch();
                    const findCmd = commands.find(x => x.name === notInFiles.name);

                    if (findCmd) {
                        await guild.commands.delete(findCmd.id);
                        returnString += `Successfully Removed "${color.bold.white(notInFiles.name)}" application command "${color.bold.white(guild.name)}"\n`;
                    }
                }

                return returnString;
            }
        }

        // If the command is in files
        if (command && command.commandType === SlashGuild) {
            const { config, data } = command;
            const guildArr = filterGuilds(config.uniqueGuilds ? config.uniqueGuilds : guilds, client);

            if (!guildArr) return `Failed to remove "${color.bold.white(data.name)} from guilds provided due to lack of access."`;

            let returnString = '';

            for (const guild of guildArr) {
                const commands = await guild.commands.fetch();
                const findCmd = commands.find(x => x.name === data.name);

                if (findCmd) {
                    await guild.commands.delete(findCmd.id);
                    returnString += `Successfully Removed "${color.bold.white(data.name)}" application command from "${color.bold.white(guild.name)}"\n`;
                }
            }

            return returnString;
        } else if (command && command.commandType === Slash) {
            const { data } = command;
            const commands = await client.application?.commands.fetch();
            const findCommand = commands ? commands.find(x => x.name === data.name) : undefined;


            if (findCommand) {
                await client.application?.commands.delete(findCommand.id);

                return `Successfully Removed "${color.bold.white(data.name)}" application command.`;
            }
        }
    };

    update = async (command: Command, client: Client, guilds: string[], options: {
        legacyCommands: {enabled: boolean, prefix: string, delays: boolean},
        slashCommands: {enabled: boolean, guilds: string[], delays: boolean}
    }) => {
        this.delete(client, guilds, command);
        this.create(command, client, guilds, options);

        return `Successfully updated "${color.bold.white(command.data.name)}" application command.`;
    };
}

