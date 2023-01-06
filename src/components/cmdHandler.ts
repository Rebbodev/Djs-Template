import { globalVars } from '../data/js/configData';
import { CH } from '../project/command-handler/classes/CommandHandler';
import { cmdDelays } from '../project/command-handler/functions/rules/delays';
import { devMode } from '../project/command-handler/functions/rules/devmode';
import { requiredPerms } from '../project/command-handler/functions/rules/requiredPerm';
import { requiredRoles } from '../project/command-handler/functions/rules/requiredRoles';
import { botClient } from '../util/clients/discord';


export const cmdHandler = new CH({
    client: botClient,
    guilds: globalVars.slashCommands.guilds,
    commands: [],
    events: [],
    rules: [
        cmdDelays,
        requiredRoles,
        requiredPerms,
        devMode
    ],
    options: {
        legacyCommands: globalVars.legacyCommands,
        slashCommands: globalVars.slashCommands
    }
});