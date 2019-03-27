'use strict';

/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
const mongoose = require('mongoose');
const logger = require("../../common-lib/logger");
const env = require('dotenv').config();
mongoose.Promise = require('bluebird');
let uri
if(process.env.MODE === 'PROD') {
    let uri = process.env.MONGODB_URI;
} else {
    uri = 'mongodb://127.0.0.1:27017/dev_db'
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

