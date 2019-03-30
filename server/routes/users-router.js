'use strict';
const express = require('express');
const middleware = require('../../common-lib/middleware');
const router = express.Router();
const logger = require("../../common-lib/logger");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mailgun = require('../mailgun/mailgun'),
    verification = require('../mailgun/verification');
let config = require('../config/db');
let db = require("../db/db");
let User = require('../db/model/user');
let Token = require("../db/model/token");
require('../config/passport')(passport);


router.post('/email/verification', async function (req, res, next) {
    let newToken;
    User.find({email: req.body.email}, function (err, data) {
        if(data.length !== 0) return res.status(400).send({message:"This email has been registered."});
    });
    if (req.body.email) {
        newToken = new Token({
            email: req.body.email,
            token: verification.generateCode(),
        });
    } else {
        return res.status(400).send({message: "Bad request"});
    }

    let error = false;
    Token.find({email: req.body.email}, async function (err, data) {
        if (data.length !== 0) return res.status(400).send({message: "incorrect verification request, check your mailbox or email address"});
        else {
            let error = false;
            try {
                logger.info(newToken.email, newToken.token);
                await mailgun.send(newToken.email, newToken.token);
            } catch (e) {
                error = true;
            }
            newToken.save(function (err) {
                if (err || error) {
                    return res.status(400).send({message: "incorrect verification request, check your mailbox or email address"});
                }
                res.json({success: true});
            })
        }
    });

});

/*https://medium.com/@yugagrawal95/mongoose-mongodb-functions-for-crud-application-1f54d74f1b34*/
router.post('/register', middleware.checkUsername, function (req, res, next) {
    logger.debug("received new user register info: ", {username: req.body.code, email: req.body.email, password: req.body.password});
    if (req.body.username && req.body.password && req.body.email && req.body.code) {
        Token.findOne({email: req.body.email}, function (err, token) {
            if (err) return next(err);
            if (!token) return res.status(401).send({message: "You need verification to register, click verify to get it."});
            if (token.token === req.body.code) {
                let newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                });
                newUser.save(function (err, user) {
                    if (err) {
                        logger.error(err);
                        return res.status(400).send({message: "Username or email already exist"});
                    } else {
                        logger.info("new user registered: ", user);
                        return res.json({success: true, msg: 'User registered'});
                    }
                });
            } else {
                res.status(401).send({message: "incorrect verification code, check your mail"});
            }
        });
    } else {
        let err = new Error("Require username and password, but one of them is missing");
        err.statusCode = 400;
        return next(err);
    }
});

router.post('/', middleware.checkUsername, function (req, res, next) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) return next(err);
        if (!user) {
            res.status(401).send({message: "User does not exist"});
        } else {
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
