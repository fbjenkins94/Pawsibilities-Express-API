const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Shelter = mongoose.model('Shelter');
const shelterAuth = require('../middlewares/shelterAuth');
const shelterRouter = express.Router();

shelterRouter.get(shelterAuth, (req, res) => {
    res.send(`Your email: ${req.shleter.email}`);
});

shelterRouter.post('/signup', async (req, res) => {
    const { name, code, location, email, password } = req.body;
    try {
        const shelter = new Shelter({ name, code, location, email, password });
        await shelter.save();
        const token = jwt.sign({ shelterId: shelter._id }, 'MY_KEY');
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

shelterRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log(JSON.stringify(req.body));
    if (!email || !password) return res.status(422).send({ error: 'Must provide email and password' });

    const shelter = await Shelter.findOne({ email });
    if (!shelter) return res.status(404).send({ error: 'Invalid credentials 1' });
    try {
        await shelter.comparePassword(password);
        const token = jwt.sign({ shelterId: shelter._id }, 'MY_KEY');
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid credentials' });
    }
});

shelterRouter.delete('/delete', shelterAuth, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).send({ error: 'Must provide email and password' });

    const shelter = await Shelter.findOne({ email });
    if (!shelter) return res.status(404).send({ error: 'Invalid credentials' });
    try {
        await shelter.comparePassword(password);
        await shelter.deleteOne({ email });
        res.send('SUCCESS!');
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

shelterRouter.put('/modify', async (req, res) => {
    const { email, password, modifications } = req.body
    if (!email) return res.status(422).send({ error: 'Must provide email' });

    const shelter = await Shelter.findOne({ email });
    if (!shelter) return res.status(404).send({ error: 'Must provide a valid email' });
    try {
        let updatedShelter;
        if (modifications.password) {
            await shelter.comparePassword(password);
            shelter.password = modifications.password;
            updatedShelter = await shelter.save();
        } else updatedShelter = await Shelter.findOneAndUpdate({ email: email }, modifications, { new: true });
        res.send(updatedShelter);
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

//get function for favorite animals 
//set function for favorite animals
//delete function for favorite animals

module.exports = shelterRouter;