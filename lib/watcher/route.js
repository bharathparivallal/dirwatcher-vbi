// import { validator } from './validator';

const express = require('express');
const route = express.Router();
const { watcher_logs, check_dir, setting_set } = require('./controller');

// route.get('/', controller.check_dir);
route.get('/log', watcher_logs);
route.get('/check_dir', check_dir);
route.post('/', setting_set);
// route.post('/list', controller.list_values);
// route.get('/:id', validator.controller_id, controller.list_id);
// route.put('/:id', validator.controller_id, validator.controller, controller.update);
// route.delete('/:id', validator.controller_id, controller.delete);
module.exports = route;
