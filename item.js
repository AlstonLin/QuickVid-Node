var mongoose = require('mongoose');
var Counter = require('./counter.js');
var Schema = mongoose.Schema;

var itemSchema = mongoose.Schema({
  url : String,
  likes : Number,
  passes : Number
});

itemSchema.pre('save', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'itemId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
    });
});
module.exports = mongoose.model('item', itemSchema);
