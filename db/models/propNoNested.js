const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nameShort: {
        type: String,
        required: true
    },
    types: {
        type:Array,
        required: true
    }
});

const Element = mongoose.model('PropNoNested', elementSchema);

module.exports = Element;