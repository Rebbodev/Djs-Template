import { jsonEditor } from '../../util/classes/jsonEditor';
import { delays } from '../../util/types/delay-data';
import jsonDelays from '../json/delays.json';
import { globalVars } from './configData';

export const delayData : delays = jsonDelays;
const filePath = globalVars.filePaths['cmdDelays'];
const uploader = new jsonEditor(filePath, false);

setInterval(() => {

    for (const delay in delayData.legacy) {
        if (delayData.legacy[delay] - Date.now() <= 0) delete delayData.legacy[delay];
    }

    for (const delay in delayData.slash) {
        if (delayData.slash[delay] - Date.now() <= 0) delete delayData.slash[delay];
    }

    uploader.insert(delayData);
}, 10000);