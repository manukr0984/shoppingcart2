var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var Address = require('../models/address');
var Payment = require('../models/payment');



/* GET home page. */
router.get('/', function(req, res, next) {
	Product.find(function(err, docs){
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
	});
	
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
})

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/shopping-cart');
	});
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


router.get('/shopping-cart', function(req, res, next) {
	if(!req.session.cart)
	{
		return res.render('shop/shopping-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var payments = new Payment();
    var addresses = new Address();
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    Payment.find({user: req.user}, function(err, docs){
        payments = docs;console.log(payments);
    });
    Address.find({user: req.user}, function(err, docs){
		res.render('shop/checkout', {total: cart.totalPrice, addresses: docs, payments: payments, errMsg: errMsg, noError: !errMsg});
    });
        
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
        var order = new Order({
            user: req.user,
            cart: cart,
            addresses: req.body.addresses,
            payment: req.body.payment,
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 


router.get('/address', isLoggedIn, function (req, res, next) {
    var messages = req.flash('error');
	res.render('shop/address', {});
});

router.post('/address', isLoggedIn, function(req, res, next) {
        var address = new Address({
            user: req.user,
            address1: req.body.address1,
			city: req.body.city,
			state: req.body.state,
			country: req.body.country,
			zip: req.body.zip,
			mobile: req.body.mobile
        });console.log(address);
        address.save(function(err, result) {
            
            req.flash('success', 'Successfully added address!');
            res.redirect('/user/userAddresses');
        });
    }); 

    router.get('/payment', isLoggedIn, function (req, res, next) {
        var messages = req.flash('error');
        res.render('shop/payment', {});
    });
    
    router.post('/payment', isLoggedIn, function(req, res, next) {
            var payment = new Payment({
                user: req.user,
                cardName: req.body.cardName,
                cardNumber: req.body.cardNumber,
                expMonth: req.body.expMonth,
                expYear: req.body.expYear,
                cvc: req.body.cvc
            });
            payment.save(function(err, result) {
                
                req.flash('success', 'Successfully added payment!');
                res.redirect('/user/userPaymentMethods');
            });
}); 
	

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}