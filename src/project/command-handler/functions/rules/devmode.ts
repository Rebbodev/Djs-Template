import { ChatInputCommandInteraction, Message } from 'discord.js';
import { globalVars } from '../../../../data/js/configData';
import { Command } from '../../util/types/commands';
import { ruleFunc } from '../../util/types/rules';


export const devMode: ruleFunc = async (action: Message | ChatInputCommandInteraction, command: Command) => {
    const returnStatus = {
        perm: true,
        reason: ''
    };

    if (!command.config.devMode) return returnStatus;

    const check = action.member ? globalVars.settings.devId.includes(action.member?.user.id) : false;

    if (!check) {
        returnStatus.perm = false;
        returnStatus.reason = 'This command can only be used by developers of the bot';
    }

    return returnStatus;
};