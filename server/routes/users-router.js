'use strict';

const express = require('express');
const middleware = require('../../common-lib/middleware');
const router = express.Router();
const logger = require("../../common-lib/logger");
const jwt = require('jsonwebtoken');
const passport = require('passport');
let config = require('../config/db');
let db = require("../db/db");
let User = require('../db/model/user');
require('../config/passport')(passport);
// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
    logger.info('Request URL:', req.originalUrl);
}, function (req, res, next) {
    logger.info('Request Type:', req.method);
});

/*https://medium.com/@yugagrawal95/mongoose-mongodb-functions-for-crud-application-1f54d74f1b34*/
router.post('/register', middleware.checkUsername, function (req, res, next) {
    logger.debug("received new user register info: ", {username: req.body.username, password: req.body.password});

    if (req.body.username && req.body.password && req.body.email) {
        let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err, user) {
            if (err) {
                logger.error(err);
                res.status(400).send({message: "Username already exist"});
            } else {
                logger.info("new user registered: ", user);
                res.json({success: true, msg: 'User registered'});
                req.session.userId = user._id;
            }
        });

        // debug info
        User.find({username: req.body.username})
            .then((data) => {
                logger.info("saved new user:", data);
            })
            .catch((err) => {
                logger.info(err);
            });
    } else {
        let err = new Error("Require username and password, but one of them is missing");
        err.statusCode = 400;
        return next(err);
    }
});

router.post('/', middleware.checkUsername, function (req, res, next) {
    logger.info("user login : ", {username: req.body.username, password: req.body.password});
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) return next(err);
        if (!user) {
            res.status(401).send({message: "User does not exist"});
        } else {
            logger.info(user);
            user.comparePassword(req.body.password, function (err, pass) {
                if (err) res.status(401).send({message: 'Password is wrong'});
                if (!pass) res.status(401).send({message: 'Password is wrong'});
                if (pass & !err) {
                    let token = jwt.sign(user.toJSON(), config.secret);
                    req.session.username = user.username;
                    res.json({success: true, token: token, name: user.username, email: user.email});
                }
            });
        }
    });
});


router.get('/profile/', passport.authenticate('jwt', {session: true}), function (req, res, next) {
    let token = req.headers.authorization;
    logger.info(req.headers);
    if (token) {
        User.findById(req.session.username).exec(function (err, user) {
            logger.info(user);
            if (err) {
                return next(err);
            } else {
                res.json({name: user.username, email: user.email});
            }
        });
    }
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                res.json({result: "yay"});
            }
        });
    }
});


module.exports = router;
