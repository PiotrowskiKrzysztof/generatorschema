const express = require('express');
const router = express.Router();

const generatorController = require('../controllers/generatorController');
const loadData = require('../controllers/ApplicationsController');

router.get('/asd', loadData.store);
router.get('/', generatorController.getAllElements);
router.get('/loaddata', generatorController.getElementsNoNested);
router.get('/loadprops', generatorController.getPropsNoNested);
router.get('/:nameShort', generatorController.getElement);
router.get('/nonested', generatorController.getElementsNoNested);

module.exports = router;