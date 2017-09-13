var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipmentSchema = Schema(
  {
    id: {type: Number},
    date_arriving: {type: Date},
    count: {type: Number},
    product_id: {type: Number}, //{type: Schema.ObjectId, ref: 'Product', required: true},
    date_spoiling: {type: Date}
  }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);
