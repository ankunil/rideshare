var AppDispatcher = require('../AppDispatcher');
var RideConstants = require('../constants/RideConstants');
var RequestConstants = require('../constants/RequestConstants');
var NotificationConstants = require('../constants/NotificationConstants');

var ServerActions = {

  registeredUser: function(user){
    AppDispatcher.dispatch({
      type: RideConstants.REGISTERED_USER,
      user: user
    });
  },

  signedInUser: function(user){
    AppDispatcher.dispatch({
      type: RideConstants.SIGNED_IN_USER,
      user: user
    });
  },

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

  updatedRide: function(ride){
    AppDispatcher.dispatch({
      type: RideConstants.RIDE_UPDATED,
      ride: ride
    })
  },

  deletedRide: function(id){
    AppDispatcher.dispatch({
      type: RideConstants.RIDE_DELETED,
      id: id
    });
  },

  createdRequest: function(request){
    AppDispatcher.dispatch({
      type: RequestConstants.REQUEST_CREATED,
      request: request
    });
  },

  updatedRequest: function(request){
    AppDispatcher.dispatch({
      type: RequestConstants.REQUEST_UPDATED,
      request: request
    })
  },

  deletedRequest: function(id){
    AppDispatcher.dispatch({
      type: RequestConstants.REQUEST_DELETED,
      id: id
    });
  },

  signInNotification: function(body){
    AppDispatcher.dispatch({
      type: NotificationConstants.SIGN_IN_NOTIFICATION,
      body: body
    })
  },

  registerNotification: function(body){
    AppDispatcher.dispatch({
      type: NotificationConstants.REGISTER_NOTIFICATION,
      body: body
    })
  },

  createRideNotification: function(body){
    AppDispatcher.dispatch({
      type: NotificationConstants.CREATE_RIDE_NOTIFICATION,
      body: body
    })
  }
};

module.exports = ServerActions;
