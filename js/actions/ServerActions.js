var AppDispatcher = require('../AppDispatcher');
var RideConstants = require('../constants/RideConstants');

var ServerActions = {
  loadedRides: function(rides){
    AppDispatcher.dispatch({
      type: RideConstants.RIDES_LOADED,
      rides: rides
    });
  }
};

module.exports = ServerActions;
