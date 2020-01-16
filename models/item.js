var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
  counter: { type: Number, required: true }
});

// Export the model
module.exports = mongoose.model('Item', ItemSchema);
