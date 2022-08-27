const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const shelterSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    code: {
        type: Number,
        unique: true,
        required: true
    },
    location: {
        type: Number,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    }
});

shelterSchema.pre('save', function (next) {
    const shelter = this;
    if (!shelter.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(shelter.password, salt, (err, hash) => {
            if (err) return next(err);
            shelter.password = hash;
            next();
        });
    });
});

shelterSchema.methods.comparePassword = function (candidatePassword) {
    const shelter = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, shelter.password, (err, isMatch) => {
            if (err) return reject(err);
            if (!isMatch) return reject(false);
            resolve(true);
        });
    });
};

mongoose.model('Shelter', shelterSchema);