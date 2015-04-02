var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RideConstants = require('../constants/RideConstants');
var ViewActions = require('../actions/ViewActions');
var assign = require('object-assign');
var _ = require('lodash');

var events = new EventEmitter();

var CHANGE_EVENT = 'change';

var state = {
  rides: []
};

var setState = function(newState){
  assign(state, newState);
  events.emit(CHANGE_EVENT);
};

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
    eventSrc.addEventListener("ride", this._sseUpdate);
  },

  _sseUpdate: function(event){
    var newRide = JSON.parse(event.data);
    var rideIds = _.pluck(state.rides, 'id');
    var containsRide = _.contains(rideIds, newRide.id);

    if(!containsRide){
      ViewActions.loadRides();
    }
  }
};

RideStore._createEventSources();

RideStore.dispatchToken = AppDispatcher.register(function(payload){
  console.log(payload.type);

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

  if(payload.type === RideConstants.RIDE_DELETED){
    var newState = state.rides.filter(function(obj){
      return obj.id !== payload.id
    });
    setState({
      rides: newState
    });
  }

});

module.exports = RideStore;
