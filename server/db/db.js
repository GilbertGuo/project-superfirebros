/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
const mongoose = require('mongoose');
const logger = require("../../common-lib/logger");
const env = require('dotenv').config();

// let server = '127.0.0.1:27017';
let server = process.env.DB_SERVER;
let database = process.env.DB;
let mongoDB = `mongodb://${server}/${database}`;

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

