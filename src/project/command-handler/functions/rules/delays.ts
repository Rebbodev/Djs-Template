import { ChatInputCommandInteraction, Message } from 'discord.js';
import ms from 'ms';
import { delayData } from '../../../../data/js/delayData';
import { Command, CommandTypes } from '../../util/types/commands';
import { ruleFunc } from '../../util/types/rules';

export const cmdDelays: ruleFunc = async (action: Message | ChatInputCommandInteraction, command: Command) => {

    const returnStatus = {
        perm: true,
        reason: ''
    };

    if (!command.config.cooldown) return returnStatus;
    const structure = {
        cmdName: `${command.data.name}`,
        userId: command.config.cooldown?.global ? '' : `_${action.member?.user.id}`,
        serverId: command.config.cooldown?.perServer ? `_${action.guild?.id}` : ''
    };

    const keyString = `${structure.cmdName}${structure.userId}${structure.serverId}`;

    const addedTime = Date.now() + command.config.cooldown.length;

    if (command.commandType === CommandTypes.Legacy) {
        const findOld = delayData.legacy[keyString];

        if (!findOld || findOld - Date.now() <= 0) {
            delayData.legacy[keyString] = addedTime;
        } else if (findOld - Date.now() > 0) {
            returnStatus.perm = false;
            returnStatus.reason = `Slowdown! You can use this command in ${ms(findOld - Date.now())}`;
        }

    }

    if (command.commandType === CommandTypes.Slash || command.commandType === CommandTypes.SlashGuild) {
        const findOld = delayData.slash[keyString];

        if (!findOld || findOld - Date.now() <= 0) {
            delayData.slash[keyString] = addedTime;
        } else if (findOld - Date.now() > 0) {
            returnStatus.perm = false;
            returnStatus.reason = `Slowdown! You can use this command in ${ms(findOld - Date.now())}`;
        }

    }

    return returnStatus;

};