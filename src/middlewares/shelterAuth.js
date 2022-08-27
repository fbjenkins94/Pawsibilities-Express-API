const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Shelter = mongoose.model('Shelter');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization ==== 'Bearer lksjdlfkaslnk'
    if (!authorization) return res.status(401).send({ error: 'You must be logged in.' });

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_KEY', async (err, payload) => {
        if (err) return res.status(401).send({ error: 'You must be logged in.' });

        const { shelterId } = payload;
        const shelter = await Shelter.findById(shelterId);
        req.shelter = shelter;
        next();
    });
};