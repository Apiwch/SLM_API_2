const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 4000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://keng:oxzaEFSCJh5GapJF@cluster0.nrku91f.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('connected')).catch((err) => console.error(err));

// Define a Mongoose model
const SLModel = mongoose.model('SLModel', {
    SL: String,
    timestamp: Date
});

app.get('/', function (req, res) {
    res.json("Hello");
});

app.post('/api/SLM', function (req, res) {
    const SL = req.query.SLM;
    const timestamp = new Date();

    // Create a new instance of the SLModel
    const newSLRecord = new SLModel({
        SL: SL,
        timestamp: timestamp
    });

    // Save the new SL record to the database
    newSLRecord.save()
        .then(() => {
            res.send('Success: ' + SL);
        })
        .catch((error) => {
            res.status(500).send('Error: ' + error.message);
        });
});

app.get('/api/SLM', function (req, res) {
    // Retrieve data from the database
    SLModel.find({})
        .exec()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).send('Error: ' + error.message);
        });
});

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});
