var ApiUtils = require('../utils/ApiUtils');

var RideActions = {
  loadRides: function(){
    ApiUtils.loadRides();
  },

  createRide: function(ride){
    ApiUtils.createRide(ride);
  }
};

module.exports = RideActions;
