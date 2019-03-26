function errorHandler(err, req, res, next) {
    if (err.statusCode === 400) {
        return res.status(400).send({ message: err.message });
    }

    if (err.status === 401) {
        return res.status(401).send({ message: 'Unauthenticated' });
    }

    return res.status(500).send({ message: err.message });
}

module.exports = errorHandler;
