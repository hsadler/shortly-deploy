var mongooseDb = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = mongooseDb.Schema({
  username: String,
  password: String
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(callback){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      console.log("this in hashPassword", this);
      this.password = hash;
      callback();
    });
};


var User = mongooseDb.model('User', userSchema);

module.exports = User;
