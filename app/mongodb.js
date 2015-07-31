var mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production')
  mongoose.connect('mongodb://MongoLab-o:BtguKZEBvXF0neM_zsSfvTlR28j7mW5SKFv1WgyHTVg-@ds038888.mongolab.com:38888/MongoLab-o');
else
  mongoose.connect('mongodb://localhost/my_database');

var db = mongoose.connection;

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

var linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

var Link = mongoose.model('Link', linkSchema);