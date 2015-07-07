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

function notifyDriverOfJoin(userId, rideId, username){
  return {
    userId: userId,
    rideId: rideId,
    message: `${username} joined your ride.`
  };
}

function notifyRiderOfJoin(userId, rideId, username){
  return {
    userId: userId,
    rideId: rideId,
    message: `You joined ${username}'s ride.`
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
    setState({
      rides: payload.rides
    });
  }

  if(payload.type === RideConstants.RIDE_CREATED){
    state.rides.push(payload.ride);
    setState({
      rides: state.rides
    });
  }

  if(payload.type === RideConstants.RIDE_UPDATED){
    var filteredRides = state.rides.filter(function(obj){
      return obj.id !== payload.ride.id
    });

    filteredRides.push(payload.ride);

    setState({
      rides: filteredRides
    });
  }

  if(payload.type === RideConstants.RIDE_DELETED){
    var filteredRides = state.rides.filter(function(obj){
      return obj.id !== payload.id
    });
    setState({
      rides: filteredRides
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
    ViewActions.createNtf(notifyDriverOfJoin(ride.userId, ride.id, request.user.username));
    ViewActions.createNtf(notifyRiderOfJoin(request.userId, ride.id, ride.user.username));
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
  }
});

module.exports = RideStore;
