var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RideConstants = require('../constants/RideConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewActions = require('../actions/ViewActions');
var assign = require('object-assign');
var _ = require('lodash');

var events = new EventEmitter();

var CHANGE_EVENT = 'change';

var state = {
  rides: [],
  requests: {},
  currentUser: null
};

var setState = function(newState){
  assign(state, newState);
  events.emit(CHANGE_EVENT);
};

function buildNtf(userId, rideId, message){
  return {
    userId: userId,
    rideId: rideId,
    message: message
  };
}

var RideStore = {
  addChangeListener: function(fn){
    events.addListener(CHANGE_EVENT, fn);
  },

  removeChangeListener: function(fn){
    events.removeListener(CHANGE_EVENT, fn);
  },

  getState: function(){
    return state;
  },

  _createEventSources: function(){
    var eventSrc = new EventSource('/rides/events');
    eventSrc.addEventListener("newRide", this._sseNewRide);
    eventSrc.addEventListener("updateRide", this._sseUpdateRide);
    eventSrc.addEventListener("deleteRide", this._sseDeleteRide);
  },

  _sseNewRide: function(event){
    var newRide = JSON.parse(event.data);
    var rideIds = _.pluck(state.rides, 'id');
    var containsRide = _.contains(rideIds, newRide.id);

    if(!containsRide){
      ViewActions.loadRides();
    }
  },

  _sseUpdateRide: function(event){
    var updatedRide = JSON.parse(event.data);
    var exactMatch = _.contains(state.rides, updatedRide);

    if(!exactMatch){
      ViewActions.loadRides();
      ViewActions.loadRequests();
    }
  },

  _sseDeleteRide: function(event){
    var ride = JSON.parse(event.data);
    var deletedId = parseInt(ride.id);
    var rideIds = _.pluck(state.rides, 'id');
    var containsRide = _.contains(rideIds, deletedId);

    if(containsRide){
      ViewActions.loadRides();
    }
  }
};

RideStore._createEventSources();

RideStore.dispatchToken = AppDispatcher.register(function(payload){
  console.log('ridestore payload:', payload);

  if(payload.type === RideConstants.REGISTERED_USER){
    setState({
      currentUser: payload.user
    });
  }

  if(payload.type === RideConstants.SIGNED_IN_USER){
    setState({
      currentUser: payload.user
    });
  }

  if(payload.type === RideConstants.RIDES_LOADED){
    payload.rides = _.sortBy(payload.rides, 'leavingAt');

    setState({
      rides: payload.rides
    });
  }

  if(payload.type === RideConstants.RIDE_CREATED){
    state.rides.push(payload.ride);

    state.rides = _.sortBy(state.rides, 'leavingAt');

    setState({
      rides: state.rides
    });
  }

  if(payload.type === RideConstants.RIDE_UPDATED){
    var filteredRides = state.rides.filter(function(obj){
      return obj.id !== payload.ride.id
    });

    filteredRides.push(payload.ride);

    filteredRides = _.sortBy(filteredRides, 'leavingAt');

    setState({
      rides: filteredRides
    });
  }

  if(payload.type === RideConstants.RIDE_DELETED){
    var rideId = payload.id;
    var driver;
    var filteredRides = [];

    _.each(state.rides, function(ride){
      if(ride.id === rideId){
        driver = ride.user;
      } else {
        filteredRides.push(ride);
      }
    });

    filteredRides = _.sortBy(filteredRides, 'leavingAt');

    setState({
      rides: filteredRides
    });

    ViewActions.createNtf(buildNtf(driver.id, rideId, 'You cancelled your ride.'));
    var userIds = _.pluck(state.requests[rideId], 'userId');

    _.each(userIds, function(userId){
      ViewActions.createNtf(buildNtf(userId, rideId, `${driver.username} cancelled their ride.`));
    });
  }

  if(payload.type === RequestConstants.REQUESTS_LOADED){
    var sortedReqs = {};

    _.each(payload.requests, function(req){
      sortedReqs[req.rideId] ? sortedReqs[req.rideId].push(req) : sortedReqs[req.rideId] = [req];
    });

    setState({
      requests: sortedReqs
    });
  }

  if(payload.type === RequestConstants.REQUEST_CREATED){
    var request = payload.request;
    var rideReqs = state.requests[request.rideId];

    rideReqs ? rideReqs.push(request) : rideReqs = [request];
    state.requests[request.rideId] = rideReqs;

    setState({
      requests: state.requests
    });

    var ride = _.find(state.rides, { 'id': request.rideId });
    var updatedRide = {
      id: ride.id,
      spacesAvailable: ride.spacesAvailable - 1
    };

    ViewActions.updateRide(updatedRide);
    ViewActions.createNtf(buildNtf(ride.userId, ride.id, `${request.user.username} joined your ride.`));
    ViewActions.createNtf(buildNtf(request.userId, ride.id, `You joined ${ride.user.username}'s ride.`));

    if(updatedRide.spacesAvailable === 0){
      ViewActions.createNtf(buildNtf(ride.userId, ride.id, `Your ride has been filled!`));
    }
  }

  if(payload.type === RequestConstants.REQUEST_UPDATED){
    var filteredRequests = state.requests.filter(function(obj){
      return obj.id !== payload.request.id
    });

    filteredRequests.push(payload.request);

    setState({
      requests: filteredRequests
    });
  }

  if(payload.type === RequestConstants.REQUEST_DELETED){
    var request = payload.request;
    var rideReqs = state.requests[request.rideId];

    var filteredRequests = rideReqs.filter(function(obj){
      return obj.id !== request.id
    });

    state.requests[request.rideId] = filteredRequests

    setState({
      requests: state.requests
    });

    var ride = _.find(state.rides, { 'id': request.rideId });
    var updatedRide = {
      id: ride.id,
      spacesAvailable: ride.spacesAvailable + 1
    };

    ViewActions.updateRide(updatedRide);
    ViewActions.createNtf(buildNtf(ride.userId, ride.id, `${request.user.username} left your ride.`));
    ViewActions.createNtf(buildNtf(request.user.id, ride.id, `You left ${ride.user.username}'s ride.`));
  }
});

module.exports = RideStore;
