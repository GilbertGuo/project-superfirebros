'use strict';

/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
const mongoose = require('mongoose');
const logger = require("../../common-lib/logger");
const env = require('dotenv').config();
mongoose.Promise = require('bluebird');

let mongoDB;
if (process.env.MODE === 'PROD') {
    mongoDB = `${process.env.MONGOLAB_URI}`
} else {
    let server = process.env.DEV_DB_SERVER;
    let database = process.env.DEV_DB;
    mongoDB = `mongodb://${server}/${database}`;
}

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

