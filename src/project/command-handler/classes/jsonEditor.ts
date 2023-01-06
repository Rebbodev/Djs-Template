import { writeFileSync } from 'fs';
/**
 *
 */
export class jsonEditor {
    filePath:string;
    constructor (filePath: string) {
        this.filePath = filePath;
    }

    insert (data: {[key: string]: unknown}) {
        const transformToString = JSON.stringify(data);

        writeFileSync(this.filePath, transformToString);


    }
}