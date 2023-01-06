/* eslint-disable max-lines */
import { Client, Colors, EmbedBuilder } from 'discord.js';
import { logger } from '../../../util/clients/logger';
import { Command, CommandTypes } from '../util/types/commands';
import { discordEvent } from '../util/types/events';
import { ruleFunc } from '../util/types/rules';
import { Commands } from './Commands';

export class CH {
    data: {
        commands: Command[],
        events: discordEvent[],
        rules: ruleFunc[],
        client: Client,
        guilds: string[],
        options: {
            legacyCommands: {enabled: boolean, prefix: string, delays: boolean},
            slashCommands: {enabled: boolean, guilds: string[], delays: boolean}
        }
    };
    CmdsClient: Commands;
    constructor (data:{
        commands: Command[],
        events: discordEvent[],
        rules: ruleFunc[],
        client: Client,
        guilds: string[],
        options: {
            legacyCommands: {enabled: boolean, prefix: string, delays: boolean},
            slashCommands: {enabled: boolean, guilds: string[], delays: boolean}
        }
    }) {
        this.data = data;
        this.CmdsClient = new Commands();
    }

    async builder () {

        const { commands, client, guilds } = this.data;

        client.on('ready', async () => {
            // Handling SlashCommands
            for (const cmd of commands) {
                if (cmd.commandType === CommandTypes.Slash || cmd.commandType === CommandTypes.SlashGuild) {
                    const { config } = cmd;
                    const { kill, recreate } = config;
                    const { create, update } = this.CmdsClient;

                    if (!kill) {
                        const run = await create(cmd, client, guilds, this.data.options);

                        if (run && run.length > 0) logger.debug(run);
                    } else if (kill) {
                        const run = await this.CmdsClient.delete(client, guilds, cmd);

                        if (run && run.length > 0) logger.debug(run);
                    } else if (recreate) {
                        const run = await update(cmd, client, guilds, this.data.options);


                        if (run && run.length > 0) logger.debug(run);
                    }
                } else if (cmd.commandType === CommandTypes.Legacy && !cmd.config.kill) {
                    const run = await this.CmdsClient.create(cmd, client, guilds, this.data.options);


                    if (run && run.length > 0) logger.debug(run);
                }
            }

            const getGuilds = client.guilds.cache;
            const guildArr: string[] = [];

            getGuilds.map((x) => {
                const { id } = x;

                guildArr.push(id);
            });

            const { options } = this.data;
            const { slashCommands } = options;

            getGuilds.forEach(async (guild) => {
                const commands = await guild.commands.fetch();

                commands.map(async (cmd) => {
                    const findCommand = this.CmdsClient.slashCmds[cmd.name];

                    if (!slashCommands.enabled) {
                        const run = await this.CmdsClient.delete(client, guilds, undefined, {
                            name: cmd.name,
                            guilds: guildArr,
                            type: CommandTypes.SlashGuild
                        });

                        if (run && run.length > 0) logger.debug(run);
                    } else if (!findCommand) {
                        const run = await this.CmdsClient.delete(client, guilds, undefined, {
                            name: cmd.name,
                            guilds: guildArr,
                            type: CommandTypes.SlashGuild
                        });

                        if (run && run.length > 0) logger.debug(run);
                    }
                });

            });

            const getCommands = await client.application?.commands.fetch();

            getCommands?.map(async (cmd) => {
                const findCommand = this.CmdsClient.slashCmds[cmd.name];

                if (!slashCommands.enabled) {
                    const run = await this.CmdsClient.delete(client, guilds, undefined, {
                        name: cmd.name,
                        type: CommandTypes.Slash
                    });

                    if (run && run.length > 0) logger.debug(run);
                } else if (!findCommand) {
                    const run = await this.CmdsClient.delete(client, guilds, undefined, {
                        name: cmd.name,
                        type: CommandTypes.Slash
                    });

                    if (run && run.length > 0) logger.debug(run);
                }
            });
        });
    }

    async on () {
        await this.builder();
        const { client } = this.data;


        client.on('messageCreate', async (msg) => {
            const { options } = this.data;
            const { legacyCommands } = options;
            const { enabled, prefix } = legacyCommands;
            const returnCondition = !msg.content.startsWith(prefix) || msg.member?.user.bot || !enabled;

            if (returnCondition) return;

            const splitted = msg.content.split(' ');
            const cmdName = splitted[0].slice(prefix.length).toLowerCase();
            const args: string[] = splitted.slice(1);

            const getCmd = this.CmdsClient.legacyCmds[cmdName];

            if (!getCmd) return;

            let rulePerm = true;
            let reasons = '';

            for (const rule of this.data.rules) {
                const result = await rule(msg, getCmd);

                if (!result.perm) {
                    rulePerm = false;
                    reasons += `${result.reason}\n`;
                }
            }

            if (getCmd.commandType === CommandTypes.Legacy && !rulePerm) {
                const rejectEmbed = new EmbedBuilder()
                    .setDescription(reasons)
                    .setColor(Colors.Red);

                await msg.reply({
                    embeds: [rejectEmbed]
                });

                return;
            }
            if (getCmd.commandType === CommandTypes.Legacy) await getCmd.run(msg, client, args);
        });

        client.on('interactionCreate', async (interaction) => {

            const { options } = this.data;
            const { slashCommands } = options;
            const { enabled } = slashCommands;

            const returnCondition = !interaction.isChatInputCommand() || !enabled || interaction.user.bot;

            if (returnCondition) return;

            const getCmd = this.CmdsClient.slashCmds[interaction.commandName];

            if (!getCmd) {
                await interaction.reply({
                    content: 'Sorry! This command does not exist ability to use this command was a system error the command will now be removed!',
                    ephemeral: true
                });
                const getCommand = client.application?.commands.cache.get(interaction.commandName);

                if (getCommand) {
                    client.application?.commands.delete(getCommand.id);
                } else if (!getCommand) {
                    const getCommandGuild = interaction.guild?.commands.cache.get(interaction.commandName);

                    if (getCommandGuild) interaction.guild?.commands.delete(getCommandGuild.id);
                }

                return;
            }

            let rulePerm = true;
            let reasons = '';

            for (const rule of this.data.rules) {
                const result = await rule(interaction, getCmd);

                if (!result.perm) {
                    rulePerm = false;
                    reasons += `${result.reason}\n`;
                }
            }

            if ((getCmd.commandType === CommandTypes.Slash || getCmd.commandType === CommandTypes.SlashGuild) && !rulePerm) {
                const rejectEmbed = new EmbedBuilder()
                    .setDescription(reasons)
                    .setColor(Colors.Red);

                await interaction.reply({
                    embeds: [rejectEmbed]
                });

                return;
            }


            if (getCmd.commandType === CommandTypes.Slash || getCmd.commandType === CommandTypes.SlashGuild) await getCmd.run(interaction, client);

        });

        for (const event of this.data.events) {
            client.on(event.event, event.listener);
        }


    }


}