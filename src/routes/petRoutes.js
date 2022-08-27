const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Pet = mongoose.model('Pet');
const shelterAuth = require('../middlewares/shelterAuth');
const petRouter = express.Router();

petRouter.get('/pets', async (req, res) => {
    const { myPets } = req.body;
    const areaCodes = req.query.areaCodes;
    console.log("AAAA : " + areaCodes[1]);
    if (areaCodes) {

    }

    if (!myPets) res.status(422).send({ error: "Must provide pet ID's" });
    try {
        const pets = await Pet.find({ '_id': { $in: myPets } })
            .select('name sex age dangerLevel');
        return res.send(pets);
    } catch (err) {
        return res.status(422).send({ error: 'No pets match your request' });
    }
});

petRouter.get('/pets/:id', async (req, res) => {
    const petID = req.params.id;
    if (!petID) return res.status('422').send({error: 'No pet ID!'})
    try {
        const pet = await Pet.findById(petID);
        return res.send(pet);
    } catch (err) {
        return res.status(422).send({ error: 'Request was bad' });
    }
});

petRouter.get('/pets/:areaCode', async (req, res) => {
    const areaCode = req.params.areaCode;
    if (!areaCode) return res.status('422').send({ error: 'You must enter a valid area code.' })
    try {
        const pet = await Pet.find({ areaCode });
        return res.send(pet);
    } catch (err) {
        return res.status(422).send({ error: 'Request was bad' });
    }
});

petRouter.post('/pets', async (req, res) => {
    const { shelterID, species, dangerLevel, name, images, sex, age, breed, biography } = req.body;
    if (!shelterID, !species || !dangerLevel || !name) res.status(422)
        .send({ error: 'Pet must have a species, danger level, and name' });
    try {
        const pet = new Pet({
            shelterID,
            species,
            dangerLevel,
            name,
            images: images ? images : [],
            sex: sex ? sex : ' ',
            age: age ? age : ' ',
            breed: breed ? breed : ' ',
            biography: biography ? biography : ' '
        });
        await pet.save();
        res.status(201).send({ message: `You have published a new pet! ID:  ${pet._id}` });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

petRouter.put('/pets/:id', shelterAuth, async (req, res) => {
    const { shelterID, modifications } = req.body
    const _id = req.params.id;

    try {
        const updatedPet = await Pet.findOneAndUpdate({ shelterID, _id }, modifications, { new: true });
        return res.send(updatedPet);
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

petRouter.delete('/pets/:id', shelterAuth, async (req, res) => {
    const { shelterID } = req.body;
    const _id = req.params.id;
    const pet = Pet.findOne({ shelterID, _id });

    if (!pet.name) return res.status(422).send({ error: "No pet matches your request" });
    try {
        await Pet.findOneAndDelete({ shelterID, _id });
        return res.status(404).send({ message: 'You have successfully deleted a pet.' });
    } catch (err) {
        return res.status(422).send({ error: 'NO pet matches your request' });
    }
});

module.exports = petRouter;