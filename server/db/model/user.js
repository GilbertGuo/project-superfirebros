/* https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57 */
let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        },
    },
    validated: Boolean,
    username: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return validator._isAlphanumeric(value)
        },
    },
    password: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model('User', userSchema);
