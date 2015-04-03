var ServerActions = require('../actions/ServerActions');
var Utils = require('../../functions');

var ApiUtils = {
  loadRides: function(){
    Utils.getRides(function(rides){
      ServerActions.loadedRides(rides);
    });
  },

  createRide: function(ride){
    Utils.createRide(ride, function(createdRide){
      ServerActions.createdRide(createdRide);
    });
  },

  updateRide: function(ride){
    Utils.updateRide(ride, function(updatedRide){
      ServerActions.updatedRide(updatedRide);
    });
  },

  deleteRide: function(id){
    Utils.deleteRide(id, function(id){
      ServerActions.deletedRide(id);
    });
  },

  createRequest: function(request){
    Utils.createRequest(request, function(createdReq){
      ServerActions.createdRequest(createdReq);
    })
  },

  updateRequest: function(request){
    Utils.updateRequest(request, function(updatedReq){
      ServerActions.updatedRequest(updatedReq);
    });
  },

  deleteRequest: function(id){
    Utils.deleteRequest(id, function(id){
      ServerActions.deletedRequest(id);
    });
  },


};

module.exports = ApiUtils;
