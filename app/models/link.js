var mongooseDb = require('../config');
var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });


var linkSchema = mongooseDb.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

linkSchema.methods.createHash = function(callback) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  this.save();
};

linkSchema.post('save', function(link) {
  this.createHash();

});

var Link = mongooseDb.model('Link', linkSchema);

module.exports = Link;
