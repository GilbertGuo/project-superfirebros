const env = require('dotenv').config();

let mongodb;
if (process.env.MODE === 'PROD') {
    mongodb = process.env.MONGODB_URI;
} else {
    mongodb = 'mongodb://127.0.0.1:27017/dev_db';
}
module.exports = {
    secret: "CSCC09 TOPSECRET",
    uri: mongodb
};
