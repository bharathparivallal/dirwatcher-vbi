const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { WATCHERS } = require('../utility/constants');

const watcher_logs = new Schema(
  {
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
