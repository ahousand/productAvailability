var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');

router.get('/', product_controller.index);

module.exports = router;
