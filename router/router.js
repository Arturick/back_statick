const Router = require('express').Router;
const productController = require('../controllers/Product');
const userController = require('../controllers/User');
const router = new Router();

//middleware
const authMiddleware = require('../midleware/auth-midleware');

router.post('/seller', authMiddleware, productController.sellers);
router.post('/order', authMiddleware,  productController.order);
router.post('/report', authMiddleware,  productController.reportSeller);
router.post('/get-competition', authMiddleware,  productController.getCompetition);
router.post('/get-analyze', authMiddleware,  productController.getAnalyze);
router.post('/get-by-article', authMiddleware,  productController.getByArticle);
router.post('/abc-analyze', authMiddleware,  productController.abcAnalyze);
router.post('/get-allEconomy', authMiddleware,  productController.getAllEconomy);
router.post('/get-minus', authMiddleware,  productController.getMinus);
router.post('/add-minus', authMiddleware,  productController.addMinus);
router.post('/delete-minus', authMiddleware,  productController.deleteMinus);
router.post('/get-seller-diagram', authMiddleware,  productController.getAllSellerDiagram);
router.post('/get-order-diagram', authMiddleware,  productController.getAllOrderDiagram);
router.post('/get-all-retail', authMiddleware,  productController.getAllRetail);


router.post('/user-register', userController.register);
router.post('/user-login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.post('/get-user', authMiddleware,  userController.getUser);
router.post('/update-profile', authMiddleware,  userController.updateProfile);

module.exports = router;