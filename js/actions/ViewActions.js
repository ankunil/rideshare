var ApiUtils = require('../utils/ApiUtils');

var RideActions = {
  loadRides: function(){
    ApiUtils.loadRides();
  },

  createRide: function(ride){
    ApiUtils.createRide(ride);
  },

  deleteRide: function(id){
    ApiUtils.deleteRide(id)
  }
};

module.exports = RideActions;
