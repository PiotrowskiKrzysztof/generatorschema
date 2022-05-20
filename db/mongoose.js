const mongoose = require('mongoose');
const { database } = require('../config');

mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
    if(error) {
        console.log(error);
    } else {
        console.log('db connected');
    }
});