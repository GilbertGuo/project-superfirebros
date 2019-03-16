function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }

    if (err.name === 'MongoError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.status === 401) {
        return res.json({ message: 'Unauthenticated' });
    }

    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;
