const winston = require('winston');

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}
// paso 3 - agregando nuestro custom level
const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'warn',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning',
            format: winston.format.simple()
        })
    ]
})

// middleware 
const addLogger = ( req, res, next ) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next()
}

module.exports = { logger, addLogger}