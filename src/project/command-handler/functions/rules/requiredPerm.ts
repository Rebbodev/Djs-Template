import { ChatInputCommandInteraction, Message, MessageType } from 'discord.js';
import { Command, CommandTypes } from '../../util/types/commands';
import { ruleFunc } from '../../util/types/rules';


export const requiredPerms: ruleFunc = async (action: Message | ChatInputCommandInteraction, command: Command) => {

    const returnStatus = {
        perm: true,
        reason: ''
    };
    const ifLegacy = command.commandType === CommandTypes.Legacy && action.type === MessageType.Default ;

    if (ifLegacy) {
        const { config } = command;
        const { permission } = config;

        if (!permission) return returnStatus;

        const hasPermission = action.member?.permissions.has(permission);

        if (!hasPermission) {
            returnStatus.perm = false;
            returnStatus.reason = 'You do not have the required Permissions to run this command!';
        }

    }

    return returnStatus;
};