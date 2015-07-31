var mongooseDb = require('../config');
var crypto = require('crypto');

var linkSchema = mongooseDb.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

linkSchema.methods.createHash = function(context) {
  var shasum = crypto.createHash('sha1');
  context.code = shasum.digest('hex').slice(0, 5);

  console.log(context, context.code);
};

var Link = mongooseDb.model('Link', linkSchema);

module.exports = Link;

