export type configType = {
    settings: {devId: string[]},
    presence: {text: string, url: string},
    legacyCommands: {enabled: boolean, prefix: string, delays: boolean},
    slashCommands: {enabled: boolean, guilds: string[], delays: boolean},
    filePaths: {[key: string]: string}
}