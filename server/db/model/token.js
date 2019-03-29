'use strict';
let validator = require('validator');

let mongoose = require('mongoose');

let tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    token: String
});

let Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
