const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    shelterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
        required: true
    },
    species: {
        type: String,
        unique: false,
        required: true
    },
    dangerLevel: {
        type: String,
        unique: false,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    images: {
        type: [String],
        unique: false,
        required: false
    },
    sex: {
        type: String,
        unique: false,
        required: false
    },
    age: {
        type: Number,
        unique: false,
        required: false
    },
    breed: {
        type: String,
        unique: false,
        required: false
    },
    biography: {
        type: String,
        unique: false,
        required: false
    }
});

mongoose.model('Pet', petSchema);