require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

require("./configs/db.configs");

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

require("./configs/session.config")(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));

// default value for title local
app.locals.title = 'Finder';

//session config
 require('./configs/session.config')(app);

const index = require('./routes/index');
app.use('/', index);
const recruiter = require('./routes/recruiter.routes');
app.use('/', recruiter);
const candidate = require('./routes/candidate.routes');
app.use('/', candidate);
const login = require('./routes/auth.login.routes');
app.use('/', login)
const match = require('./routes/match.routes');
app.use('/', match)




module.exports = app;
