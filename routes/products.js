var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var product_controller = require('../controllers/productController');

router.get('/', product_controller.products_list);
router.get('/search', product_controller.product_search_form);
router.post('/search', product_controller.products_by_date);
router.get('/searchWithName', product_controller.product_search_formWithName);
router.post('/searchWithName', product_controller.product_by_dateAndName);


module.exports = router;
