const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { WATCHERS, WATCHER_SETTINGS } = require('../utility/constants');

const watcher_logs = new Schema(
    {
        // log_date: String,
        // log_time: String,
        _setting_id: {
            type: Schema.Types.ObjectId,
            ref: WATCHER_SETTINGS,
            required: true,
        },
        log: [
            {
                file_name: String,
                changes: [{ line_no: Number, occurrence: Number }],
                file_status: String,
            },
        ],
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
module.exports = mongoose.model(WATCHERS, watcher_logs);
