var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema(
  {
    id: {type: Number},
    name: {type: String},
    description: {type: String}
  }
);

module.exports = mongoose.model('Product', ProductSchema);
