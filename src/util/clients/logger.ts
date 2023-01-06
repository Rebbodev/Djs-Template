import { createLogger, shimLog } from '@lvksh/logger';
import colors from 'colors';
export const logger = createLogger({
    debug: {
        label: colors.blue('[DEBUG]'),
        newLine: colors.blue('⮡'),
        newLineEnd: colors.blue('⮡')
    },
    warning: {
        label: colors.yellow('[WARN]'),
        newLine: colors.white('     ⮡'),
        newLineEnd: colors.white('     ⮡')
    },
    startup: {
        label: colors.green('[STARTUP]'),
        newLine: colors.white('       ⮡'),
        newLineEnd: colors.white('       ⮡')
    },
    error: {
        label: colors.red('[ERROR]'),
        newLine: colors.white('      ⮡'),
        newLineEnd: colors.white('      ⮡')
    },
    fail: colors.red('[FAILED]'),
    success: colors.green('[SUCCESS]')

}, {
    padding: 'NONE'
});

shimLog(logger, 'debug');