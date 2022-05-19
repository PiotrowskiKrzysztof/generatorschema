const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//    res.render('home');
// });

const PagesController = require('../controllers/PagesController');
const ApplicationsController = require('../controllers/ApplicationsController');

router.get('/', PagesController.index);

router.post('/applications', ApplicationsController.store);

module.exports = router;