import { configType } from '../../util/types/globalVars';
import settings from '../json/config.json';

export const globalVars: configType = settings;

for (const i in globalVars.filePaths) {
    const variable = globalVars.filePaths[i];
    const replace = variable.replace('{PROCESS}', process.cwd());

    globalVars.filePaths[i] = replace;
}
