const Router = require('express').Router;
const productController = require('../controllers/Product');
const router = new Router();

router.post('/seller', productController.sellers);
router.post('/order', productController.order);
router.post('/report', productController.reportSeller);

module.exports = router;