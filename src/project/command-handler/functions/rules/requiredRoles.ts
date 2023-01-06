import { ChatInputCommandInteraction, InteractionType, Message, MessageType, PermissionsBitField } from 'discord.js';
import { Command, CommandTypes } from '../../util/types/commands';
import { ruleFunc } from '../../util/types/rules';

export const requiredRoles: ruleFunc = async (action: Message | ChatInputCommandInteraction, command: Command) => {

    const returnStatus = {
        perm: true,
        reason: ''
    };

    if (command.commandType === CommandTypes.Legacy && action.type === MessageType.Default) {
        const { config } = command;
        const { requiredRoles } = config;

        if (!requiredRoles
            || (requiredRoles && requiredRoles.adminBypass && action.member?.permissions.has(PermissionsBitField.Flags.Administrator))
            || (requiredRoles && requiredRoles.userBypass && action.member && requiredRoles.userBypass.includes(action.member.id))
        ) return returnStatus;

        const { roles, useAll } = requiredRoles;

        const check = useAll ? action.member?.roles.cache.hasAll(...roles) : action.member?.roles.cache.hasAny(...roles);

        if (!check) {
            returnStatus.perm = false;
            returnStatus.reason = 'Your roles are insufficient to run this command!';
        }
    } else if ((command.commandType === CommandTypes.Slash|| command.commandType === CommandTypes.SlashGuild) && action.type === InteractionType.ApplicationCommand) {
        const { config } = command;
        const { requiredRoles } = config;

        if (!requiredRoles
            || (requiredRoles && requiredRoles.adminBypass && action.inCachedGuild() && action.member?.permissions.has(PermissionsBitField.Flags.Administrator))
            || (requiredRoles && requiredRoles.userBypass && requiredRoles.userBypass.includes(action.user.id))
            || !action.inCachedGuild()
        ) return returnStatus;

        const { roles, useAll } = requiredRoles;

        const check = useAll ? action.member?.roles.cache.hasAll(...roles) : action.member?.roles.cache.hasAny(...roles);

        if (!check) {
            returnStatus.perm = false;
            returnStatus.reason = 'Your roles are insufficient to run this command!';
        }
    }

    return returnStatus;
};