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
    parent: {
        type: String,
        required: true
    },
    parentShort: {
        type: String,
        required: true
    },
    properties: {
        type: Array,
        required: true
    }
});

const Element = mongoose.model('ElementNoNested', elementSchema);

module.exports = Element;