const log4js = require('log4js');

let logger = log4js.getLogger();
logger.level = 'all';

logger.info("acquired logger");
module.exports = logger;
