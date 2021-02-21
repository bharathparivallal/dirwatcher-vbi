/**
 * Expose routes
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

// import * as watcher from '../watcher/route';
const watcher = require('../watcher/route');
module.exports = function routes(app) {
  const version = { v1: '/api/v1', v2: '/api/v2' };

  app.use(version.v1 + '/watcher', watcher);
};
