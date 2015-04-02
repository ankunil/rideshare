var AppDispatcher = require('../AppDispatcher');
var RideConstants = require('../constants/RideConstants');

var ServerActions = {
  loadedRides: function(rides){
    AppDispatcher.dispatch({
      type: RideConstants.RIDES_LOADED,
      rides: rides
    });
  },

  createdRide: function(ride){
    AppDispatcher.dispatch({
      type: RideConstants.RIDE_CREATED,
      ride: ride
    });
  },

  deletedRide: function(id){
    AppDispatcher.dispatch({
      type: RideConstants.RIDE_DELETED,
      id: id
    });
  }
};

module.exports = ServerActions;
