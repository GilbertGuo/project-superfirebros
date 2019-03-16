'use strict';

const express = require('express');
const middleware = require('../../common-lib/middleware');
const router = express.Router();
const logger = require("../../common-lib/logger");

let db = require("../db/db");
let User = require('../db/model/user');

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
    logger.info('Request URL:', req.originalUrl);
}, function (req, res, next) {
    logger.info('Request Type:', req.method);
});

/*https://medium.com/@yugagrawal95/mongoose-mongodb-functions-for-crud-application-1f54d74f1b34*/
router.post('/register', middleware.checkUsername,function (req, res, next) {
    logger.info("received new user register info: ", {username: req.body.username, password: req.body.password});

    if (req.body.username && req.body.password && req.body.email) {
        let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        User.create(newUser, function (err, user) {
            if (err) {
                err.status = 500;
                logger.error(err);
                return next(err);
            } else {
                logger.info("new user registered: ", user);
                req.session.userId = user._id;
            }
        });

        User.find({username: req.body.username})
            .then((data) => {
                logger.info("saved new user:", data);
            })
            .catch((err) => {
                logger.info(err);
            });
    }
});

router.post('/', middleware.checkUsername, function (req, res, next) {
    logger.info("user login : ", {username: req.body.username, password: req.body.password});
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (err, user) {
            if (err) {
                logger.error(err);
                err.status = 401;
                return next(err);
            } else {
                logger.info("user login success: ", user);
                req.session.userId = user._id;
                User.findById(req.session.userId).exec(function (err, user) {
                    if (err) {
                        return next(err);
                    } else {
                        res.json({_id: user._id, name: user.username, email: user.email});
                    }
                });
            }
        });
    }
});

router.get('/profile', middleware.requiresLogin, function (req, res, next) {
    User.findById(req.session.userId).exec(function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.json({_id: user._id, name: user.username, email: user.email});
        }
    });
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                res.json({result: "yay"});
            }
        });
    }
});


module.exports = router;
