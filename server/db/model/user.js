'use strict';

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

userSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({username: username}).exec(function (err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {
            let err = new Error('user does not exist.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, res) {
            if (err) {
                return callback(err);
            }
            if (res === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        })
    });
};
let User = mongoose.model('User', userSchema);
module.exports = User;
