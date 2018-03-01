var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var Order = require('../models/order');
var Cart = require('../models/cart');
var Address = require('../models/address');
var Payment = require('../models/payment');

var csrfProtection = csrf();
router.use(csrfProtection);

var addresses;
var payments;

router.get('/profile', isLoggedIn, function (req, res, next) {

        res.render('user/profile');
});

router.get('/userOrders', isLoggedIn, function (req, res, next) {

    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/userOrders', { orders: orders});
    });
});

router.get('/userAddresses', isLoggedIn, function (req, res, next) {
	Address.find({user: req.user}, function(err, docs){
		if (err) {
            return res.write('Error!');
		}
		addresses = docs;

        res.render('user/userAddresses', { addresses: addresses});
    });
});

router.get('/userPaymentMethods', isLoggedIn, function (req, res, next) {
	Payment.find({user: req.user}, function(err, docs){
		if (err) {
            return res.write('Error!');
		}
		payments = docs;

        res.render('user/userPaymentMethods', { payments: payments});
    });
});



router.get('/deleteAddress/:id', function(req, res, next) {
	var addressId = req.params.id;
	var address = new Address({'_id': addressId});
	address.remove((err, result) => {
		if (err) return res.send(500, err);
		req.flash('success', 'Successfully deleted address!');
		res.redirect('/user/userAddresses');
	 }); 
});



router.get('/deletePayment/:id', function(req, res, next) {
	var paymentId = req.params.id;
	var payment = new Payment({'_id': paymentId});
	payment.remove((err, result) => {
		if (err) return res.send(500, err);
		req.flash('success', 'Successfully deleted payment!');
		res.redirect('/user/userPaymentMethods');
	 }); 
});


router.get('/logout', isLoggedIn, function(req, res, next){
	req.logout();
	res.redirect('/');
});

//placed in front of signup and signin to protect routes that go there
router.use('/', notLoggedIn, function(req, res, next){
	next();
});


router.get('/signup', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}