module.exports = {
    requiresLogin: function (req, res, next) {
        if (req.session && req.session.userId) {
            return next();
        } else {
            let err = new Error('Idiot, can you please login first?');
            err.status = 401;
            return next(err);
        }
    }
};
