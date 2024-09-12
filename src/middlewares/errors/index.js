const { EError } = require('../../service/error/enums');
const { logger } = require('../../utils/logger');

const handleErrors = () => (error, req, res, next) => {
    if (typeof logger.error === 'function') {
        logger.error(`Error: ${error.message} en ${req.method} ${req.url}`);
        if (error.cause) {
            logger.info('Error cause:', error.cause);
        }
    } else {
        console.error('Logger error function is not available');
    }

    switch (error.code) {
        case EError.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: 'error', error: error.name });
        case EError.DATABASE_ERROR:
            return res.status(500).send({ status: 'error', error: error.name });
        default:
            return res.status(500).send({ status: 'error', error: 'Error no identificado' });
    }
};

module.exports = handleErrors;