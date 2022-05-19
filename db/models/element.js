const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    nameShort: {
        type: String,
        required: true
    },
    childrens: {
        type: Array
    }
});

const Element = mongoose.model('Element', elementSchema);

module.exports = Element;