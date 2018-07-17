var mongoose = require('mongoose');
var config = require('./config');
var MONGO_URI = config.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit();
});