var ApiUtils = require('../utils/ApiUtils');

var RideActions = {
  loadRides: function(){
    ApiUtils.loadRides();
  }
  // create: function(ride, user){
  //   ApiUtils.createRide(ride, user)
  //   .then({
  //     ServerAction.rideCreated();
  //   })
  //   .fail(function(){
  //     console.log("error creating ride");
  //   });
  // }
};

module.exports = RideActions;
