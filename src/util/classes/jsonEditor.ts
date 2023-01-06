import { readFileSync, writeFileSync } from 'fs';
import { globalVars } from '../../data/js/configData';
/**
 *
 */
export class jsonEditor {
    filePath:string;
    jsonLogs: boolean;
    constructor (filePath: string, jsonLogs: boolean) {
        this.filePath = filePath;
        this.jsonLogs = jsonLogs;
    }

    insert (data: {[key: string]: unknown}) {
        const transformToString = JSON.stringify(data);

        const readFile = readFileSync(this.filePath).toString();
        const toJson = JSON.parse(readFile);
        const toString = JSON.stringify(toJson);

        writeFileSync(this.filePath, transformToString);


        if (transformToString !== toString && this.jsonLogs) {
            const dataRemoved: {[key: string]: unknown} = {
            };
            const dataEdited: {[key: string]: {old: unknown, new: unknown}} = {
            };
            const dataAdded: {[key: string]: unknown} = {
            };

            for (const comparableData in data) {
                const findData = toJson[comparableData];

                if (!findData) dataAdded[comparableData] = data[comparableData];
                if (findData && findData !== data[comparableData]) dataEdited[comparableData] = {
                    old: findData,
                    new: data[comparableData]
                };
            }

            for (const comparableData in toJson) {
                const findData = data[comparableData];

                if (!findData) dataRemoved[comparableData] = toJson[comparableData];
            }

            const logPath = globalVars.filePaths['jsonEditor'];
            let logString = readFileSync(logPath).toString();

            logString += `Json data was changed in:-
filePath: "${this.filePath}"
dataAdded: ${JSON.stringify(dataAdded)}
dataRemoved: ${JSON.stringify(dataRemoved)}
dataEdited: ${JSON.stringify(dataEdited)}\n\n`;

            writeFileSync(logPath, logString);
        }


    }
}