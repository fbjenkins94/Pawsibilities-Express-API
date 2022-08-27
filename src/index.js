require('./models/User');
require('./models/Shelter');
require('./models/Pet');
const userAuth = require('./middlewares/userAuth');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const petRoutes = require('./routes/petRoutes');
const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/shelter', shelterRoutes);
app.use('/pet', petRoutes);

const mongoUri = 'mongodb+srv://fbjenkins94:<Passwod>!@cluster0.nloh8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
	console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to mongo', err);
});

app.post((req, res) => {
	console.log("HI THERE! POST");
})

app.listen(3000, () => {
	console.log('DOINK!');
});