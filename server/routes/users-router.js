const express = require('express');
const router = express.Router();
const logger = require("../../common-lib/logger");


let db = require("../db/db");
let User = require('../db/model/user');
let id = 1;

router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next()
});

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
    logger.info('Request URL:', req.originalUrl);
    next()
}, function (req, res, next) {
    logger.info('Request Type:', req.method);
    next()
});

//post
router.get('/', (req, res) => {
    logger.info("yo");
    res.json("yo");
});

/*https://medium.com/@yugagrawal95/mongoose-mongodb-functions-for-crud-application-1f54d74f1b34*/
router.post('/register', function (req, res, next) {
    logger.info("received new user register info: ", {username:req.body.username, password: req.body.password});
    let newUser = new User({
        id: id.toString(),
        email: "someone@gmail.com",
        username: req.body.username,
        password: req.body.password
    });

    User.collection.insertOne(newUser)
        .then((data) => {
            logger.info(data);
        }).catch((err) => {
        logger.error(err);
    });

    User.find({username: req.body.username})
        .then((data) => {
            logger.info("saved new user:", data);
        })
        .catch((err) => {
            logger.info(err);
        });
    res.json({username: req.body.username, password: req.body.password});
});


module.exports = router;
