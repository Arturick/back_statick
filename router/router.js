const Router = require('express').Router;
const productController = require('../controllers/Product');
const userController = require('../controllers/User');
const router = new Router();

router.post('/seller', productController.sellers);
router.post('/order', productController.order);
router.post('/report', productController.reportSeller);
router.post('/getCompetition', productController.getCompetition);
router.post('/getAnalyze', productController.getAnalyze);
router.post('/getByArticle', productController.getByArticle);
router.post('/abcAnalyze', productController.abcAnalyze);
router.post('/getAllEconomy', productController.getAllEconomy);
router.post('/getMinus', productController.getMinus);
router.post('/addMinus', productController.addMinus);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.post('/getUser', userController.getUser);
router.post('/updateProfile', userController.updateProfile);

module.exports = router;