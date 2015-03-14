var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RideConstants = require('../constants/RideConstants');
var assign = require('object-assign');

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
  }
};

RideStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  console.log(action.type);

  if(action.type === RideConstants.RIDES_LOADED){
    this.setState({
      rides: action.rides
    });
  }
});

module.exports = RideStore;
