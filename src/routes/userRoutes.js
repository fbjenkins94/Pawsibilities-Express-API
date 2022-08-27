const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const userAuth = require('../middlewares/userAuth');
const userRouter = express.Router();

userRouter.get(userAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

userRouter.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        console.log("HERE");
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'MY_KEY');
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).send({ error: 'Must provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Invalid password or email' });
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'MY_KEY');
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

userRouter.delete('/delete', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).send({ error: 'Must provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Invalid password or email' });
    try {
        await user.comparePassword(password);
        await user.deleteOne({ email });
        res.status(404).send({message: 'You have successfully deleted your account.'});
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

userRouter.put('/modify', async (req, res) => {
    const { email, password, modifications } = req.body
    if (!email) return res.status(422).send({ error: 'Must provide email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Must provide a vlaid email' });
    try {
        let updatedUser;
        if (modifications.password) {
            await user.comparePassword(password);
            user.password = modifications.password;
            updatedUser = await user.save();
        } else updatedUser = await User.findOneAndUpdate({ email: email }, modifications, {new: true});
        res.send(updatedUser);
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

module.exports = userRouter;