const validator = require("validator");

module.exports = {
    requiresLogin: function (req, res, next) {
        if (req.session && req.session.userId) {
            return next();
        } else {
            let err = new Error('Idiot, can you please login first?');
            err.status = 401;
            return next(err);
        }
    },

    sanitizeContent: function (req, res, next) {
        req.body.content = validator.escape(req.body.content);
        return next();
    },

    checkUsername: function (req, res, next) {
        if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("Username: Bad input");
        return next();
    }
}
;
