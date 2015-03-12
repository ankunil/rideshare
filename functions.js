var Q = require('q');
var Ride = require('./ride-model');

// function getRide (key) {
// };

exports.getRides = function(){
  Ride.find(function(err, docs){
    return docs;
  });
};
