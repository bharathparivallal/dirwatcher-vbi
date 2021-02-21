require('dotenv').config();
module.exports = {
  APP_STATE: process.env.NODE_ENV || 'development',
  DB_URL: process.env.dbUrl,
};
