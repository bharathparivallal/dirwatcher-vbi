const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { WATCHER_SETTINGS } = require('../utility/constants');

const watcher_logs = new Schema(
    {
        dir_location: { type: String },
        time_interval: { type: Number },
        matching_keyword: { type: String },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);
module.exports = mongoose.model(WATCHER_SETTINGS, watcher_logs);
