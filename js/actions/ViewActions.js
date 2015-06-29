var ApiUtils = require('../utils/ApiUtils');

var ViewActions = {
  checkForSession: function(){
    ApiUtils.checkForSession();
  },

  registerUser: function(user){
    ApiUtils.registerUser(user);
  },

  signInUser: function(user){
    ApiUtils.signInUser(user);
  },

  loadRides: function(){
    ApiUtils.loadRides();
  },

  createRide: function(ride){
    ApiUtils.createRide(ride);
  },

  updateRide: function(ride){
    ApiUtils.updateRide(ride);
  },

  deleteRide: function(id){
    ApiUtils.deleteRide(id);
  },

  createRequest: function(request){
    ApiUtils.createRequest(request);
  },

  updateRequest: function(request){
    ApiUtils.updateRequest(request);
  },

  deleteRequest: function(id){
    ApiUtils.deleteRequest(id);
  },

  createNtf: function(notification){
    ApiUtils.createNtf(notification);
  }
};

module.exports = ViewActions;
