const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const AutoIncrement = require('mongoose-sequence')(mongoose);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

var UrlSchema = new mongoose.Schema({
  long_end: {
    type: String,
    required: true
  }
});

var Url = mongoose.model('Url', UrlSchema);


var saveShortUrl = function(url, done) {
  var url = new Url({long_end: url});
    url.save(function(err, data){
      if(err){
        return done(err);
      }
      return done(null, data);
    });    
};

var findUrlById = function(urlId, done) {
  Url.findById({id:urlId}, function(err, data){
      if(err){
        return done(err);
      }
      return done(null, data);
    }); 
  
};

UrlSchema.plugin(AutoIncrement, {inc_field: 'id'});


exports.UrlModel = Url;
exports.saveUrl = saveShortUrl;
exports.findUrl = findUrlById;
