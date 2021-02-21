/**
 * Module dependencies.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const helmet = require('helmet');
// const utils = require('./lib/utility/util_keys');
const app = express();

/**
 * Set `views` directory for module
 */

app.set('views', path.join(__dirname, 'views'));

/**
 * Set `view engine` to `pug`.
 */

app.set('view engine', 'pug');

/**
 * middleware for favicon
 */

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.options('/', cors());
app.use(cors());

// protect against vulnerability
app.use(helmet());

/**
 * Link models with
 * mongoDB database
 */

require('./lib/models')(app);

/**
 * routes application
 */

require('./lib/routes')(app);

// /**
//  * Load auth routes and
//  * login strategies with
//  * passport
//  */
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

/**
 * GET index page.
 */

app.get('*', function (req, res) {
  res.render('index', {
    title: 'DirWatcher by Bharath Parivallal',
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    status_code: 500,
    status: false,
    message: 'App Crashed',
    data: err.message,
    ...(isProduction ? {} : { error: err }),
  });
});

module.exports = app;
