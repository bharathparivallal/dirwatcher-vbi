const express = require('express');
const route = express.Router();
const { watcher_logs, setting_set } = require('./controller');
const { setting_check } = require('./validator');

route.get('/log', watcher_logs);
route.post('/', setting_check, setting_set);

module.exports = route;
