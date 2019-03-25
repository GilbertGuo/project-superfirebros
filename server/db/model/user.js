'use strict';
/* https://www.djamware.com/post/5a878b3c80aca7059c142979/securing-mean-stack-angular-5-web-application-using-passport */
/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
let mongoose = require('mongoose');
let validator = require('validator');
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    validated: Boolean,
    username: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return validator.isAlphanumeric(value);
        },
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {type: Date, default: Date.now}
});

userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, res) {
        if (err) {
            return callback(err);
        }
        callback(null, res);
    });
};
let User = mongoose.model('User', userSchema);
module.exports = User;
