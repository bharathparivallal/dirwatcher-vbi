require('dotenv').config();
const pino = require('pino');
const logger = pino({ name: `Watcher-${process.env.NODE_ENV}` });

module.exports = {
    APP_STATE: process.env.NODE_ENV || 'development',
    DB_URL: process.env.dbUrl,
    logger,
};
