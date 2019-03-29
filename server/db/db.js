'use strict';

/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
const mongoose = require('mongoose');
const logger = require("../../common-lib/logger");
const env = require('dotenv').config();
const config = require('../config/db');
mongoose.Promise = require('bluebird');

class DB {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(config.uri, {useNewUrlParser: true}).then(() => {
            logger.info('Database connection is cool.');
        }).catch(err => {
            logger.error('Database connection is dead.');
        });
    }
}


module.exports = new DB();

