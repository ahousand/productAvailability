var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvailabilitySchema = Schema(
  {
    id: {type: Number},
    name: {type: String},
    available_dates: {type: Array},
    count: {type: Number},
    bad_dates: {type: Array}
  }
);

module.exports = mongoose.model('Availability', AvailabilitySchema);
