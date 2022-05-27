const mongoose = require('mongoose');
const { database } = require('../config');

mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true });