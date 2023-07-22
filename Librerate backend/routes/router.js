const express = require('express');
const router = express.Router();

const accountController = require('../controllers/accountController');
const publicController = require('../controllers/publicController');
const protectedController = require('../controllers/protectedController');
const searchController = require('../controllers/searchController');


// Router para los métodos del controller
router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/logout', accountController.logout);
router.get('/search', searchController.searchByFilters);
router.post('/subscription', protectedController.isAuthenticated, (req, res, next) => {
    const newSubscriptionNumber = req.body.subscriptionNumber;
    const userId = req.userId;
    protectedController.setSubscription(req, res);
});
/*router.post('/changePassword', accountController.changePassword, (req, res, next) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    accountController.changePassword(req, res);
});
router.post('/changePasswordAuthenticated', protectedController.isAuthenticated, (req, res, next) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    protectedController.changePasswordAuthenticated(req, res);
});*/

router.get('/getAllBooks', protectedController.setAuthenticatedUser, (req, res, next) => {
    publicController.getAllBooks(req, res);
} )

router.post('/deleteAccount', protectedController.isAuthenticated, (req, res, next) => {
    protectedController.deleteAccount(req, res);
});
router.post('/getUserData', protectedController.isAuthenticated, (req, res, next) => {
    protectedController.getUserData(req, res);
});

router.get('/holamundo', protectedController.isAuthenticated, (req,res,next) => {
    console.log('diego test');
    return res.status(200);
})

router.post('/addBookToList', protectedController.isAuthenticated, (req, res, next) => {
    const userId = req.userId;
    
    protectedController.addBookToList(req, res);
});
router.post('/removeBookFromList', protectedController.isAuthenticated, (req, res, next) => {
    const userId = req.userId;
    protectedController.removeBookFromList(req, res);
});
router.get('/getUserBookList', protectedController.isAuthenticated, (req, res, next) => {
    const userId = req.userId;
    console.log("request userId ==> " + req.userId);
    protectedController.getUserBookList(req, res);
});

module.exports = router;
