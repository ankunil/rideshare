var ServerActions = require('../actions/ServerActions');
var Utils = require('../../functions');

var ApiUtils = {
  loadRides: function(){
    debugger;
    Utils.getRides(function(rides){
      ServerActions.loadedRides(rides);
    });
  },

  createRide: function(ride){
    Utils.createRide(ride, function(ride){
      ServerActions.createdRide(ride);
    });
  }
};

module.exports = ApiUtils;
