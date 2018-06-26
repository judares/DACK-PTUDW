var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var productCtl = require('../controllers/productCtl');
var decentralization = require('../config/decentralization');
/* GET home page. */
router.get('/', productCtl.loadProduct);

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.json(req.session.cart.totalQty);
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    if(req.user)
    {
        var cart = new Cart(req.session.cart);
        var d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var  dt = d.getDate();
        if (dt < 10) {
            dt = '0' + dt;
        }
        if (m < 10) {
            m = '0' + m;
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.user.profile.address,
            name: req.user.profile.name,
            phone: req.user.profile.phone,
            status: -1,
            date :  dt,
            month: m,
            year: y
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }
    else {
        var cart = new Cart(req.session.cart);
        var errMsg = req.flash('error')[0];
        res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
    }
});
router.get('/contact', function (req, res, next) {
    res.render('shop/contact');
});

router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        phone: req.body.phone,
        status: false,
        date: new Date()
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
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
