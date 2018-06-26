var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');
var userController = require('../controllers/userController');
var decentralization = require('../config/decentralization');

router.get('/admin/list',isLoggedIn,decentralization.checkactive,decentralization.checkadmin,
    userController.loadUserTable);
router.get('/admin/edit/:id',isLoggedIn,decentralization.checkactive,decentralization.checkadmin,userController.edit);
router.post('/admin/edit',isLoggedIn,decentralization.checkactive,decentralization.checkadmin,userController.editAccount);
router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders ,email: req.user.email,set:req.user.active , name: req.user.profile.name,address: req.user.profile.address,phone: req.user.profile.phone});
    });
});
router.get('/change_password',isLoggedIn, decentralization.checkactive,function (req, res, next) {
    res.render('user/changepassword',{_id:req.user._id});
});
router.post('/edit_profile',isLoggedIn,decentralization.checkactive, userController.editAccountClient);
router.post('/change_password',isLoggedIn,decentralization.checkactive, userController.changePassword);
router.get('/edit_profile',isLoggedIn,decentralization.checkactive, function (req, res, next) {
    res.render('user/editprofile',{name: req.user.profile.name,address: req.user.profile.address,phone: req.user.profile.phone,_id: req.user._id});
});

router.post('/verify',userController.sendmail);

router.get('/verify/:id',userController.verify);

router.get('/reset',function (req,res,next) {
    res.render('user/resetpassword');
});
router.post('/reset',userController.sendmailresetPass);
router.post('/resetpass',userController.resetpass);
router.get('/reset/:auth',function (req,res,next) {
    res.render('user/reserpassword',{auth: req.params.auth});
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    var messagess = req.flash('success');
    res.render('user/signin', { messages: messages, hasErrors: messages.length > 0 , successMsg: messagess});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}