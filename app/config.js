var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

var db = mongoose.connection;

module.exports = mongoose;
