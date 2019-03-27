'use strict';

/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
const mongoose = require('mongoose');
const logger = require("../../common-lib/logger");
const env = require('dotenv').config();
mongoose.Promise = require('bluebird');

let mongoDB = `${process.env.MONGODB_URI}`;

class DB {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(mongoDB, {useNewUrlParser: true}).then(() => {
            logger.info('Database connection is cool.');
        }).catch(err => {
            logger.error('Database connection is dead.');
        });
    }
}


module.exports = new DB();

