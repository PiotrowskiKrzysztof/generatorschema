const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
const generatorRouter = require('./routes/generator');
const fileUpload = require('express-fileupload');
const cors = require('cors');

require('./db/mongoose');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(cors());

// app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.use('/generator/', generatorRouter);

module.exports = app;