var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/rideshare');

var rideSchema = {
    destination:String,
    spacesAvailable:Number,
    user:String
};

module.exports = mongoose.model('Ride', rideSchema, 'rides');
