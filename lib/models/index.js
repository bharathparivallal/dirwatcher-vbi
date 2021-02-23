/*
 *  Module dependencies
 */

const mongoose = require('mongoose');
const { DB_URL } = require('../utility/util_keys');
/**
 * Expose models linker helper
 *
 * @param {Express} app `Express` instance
 */

module.exports = function models() {
    /**
     *  Connect to mongo
     */
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    /**
     * Register models
     */

    require('./watcher_log');
    require('./watcher_settings');
};
