const Element = require('../db/models/element');
const ElementNoNested = require('../db/models/elementNoNested');
const PropNoNested = require('../db/models/propNoNested');

class GeneratorController {
    async getAllElements(req, res) {
        let doc;
        try {
            doc = await Element.find({});
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }        
        // console.log(doc);
        res.status(200).json(doc);
    }

    async getElement(req, res) {
        const short = req.params.nameShort;
        const element = await ElementNoNested.findOne({ nameShort: short });
        res.status(200).json(element);
    }

    async getElementsNoNested(req, res) {
        const doc = await ElementNoNested.find({});
        res.status(200).json(doc);
    }

    async getPropsNoNested(req, res) {
        const doc = await PropNoNested.find({});
        res.status(200).json(doc);
    }
}

module.exports = new GeneratorController();