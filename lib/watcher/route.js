const express = require('express');
const route = express.Router();
const { watcher_logs, setting_set } = require('./controller');

route.get('/log', watcher_logs);
route.post('/', setting_set);
module.exports = route;
