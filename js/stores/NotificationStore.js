var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NotificationConstants = require('../constants/NotificationConstants');
var assign = require('object-assign');
var _ = require('lodash');
var RideStore = require('./RideStore.js');
var events = new EventEmitter();

var CHANGE_EVENT = 'change';

var state = {
  flashes: {},
  notifications: []
};

function setState(newState) {
  assign(state, newState);
  events.emit(CHANGE_EVENT);
}

function addFlash(flash){
  var timeStamp = Date.now();
  state.flashes[timeStamp] = flash;
  var newFlashes = state.flashes;

  setState({
    flashes: newFlashes
  });

  window.setTimeout(function(){
    if(state.flashes[timeStamp]){
      delete state.flashes[timeStamp];
      events.emit(CHANGE_EVENT);
    }
  }, 5000);
}

function parseError(res){
  if (res.status === 400){
    return 'Invalid form data. Please fill out all fields.'
  }
  return res.text.match(/:\s(.*\.)</)[1];
}

function _createRide(res){
  if (res.error === false){
    return 'Ride successfully created.';
  } else {
    return parseError(res.text);
  }
}

function _signIn(res){
  if (res.error === false){
    return `Welcome, ${res.body.data.username}.`;
  } else {
    return parseError(res);
  }
}

function _register(res){
  if (res.error === false){
    return `Welcome, ${res.body.data.username}.`;
  } else {
    return parseError(res);
  }
}

var NotificationStore = {
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

NotificationStore.dispatchToken = AppDispatcher.register(function(payload){
  // console.log('notification store payload:', payload);

  if(payload.type === NotificationConstants.CREATE_RIDE_FLASH){
    var flash = _createRide(payload.res);
    addFlash(flash);
  }

  if(payload.type === NotificationConstants.SIGN_IN_FLASH){
    var flash = _signIn(payload.res);
    addFlash(flash);
  }

  if(payload.type === NotificationConstants.REGISTER_FLASH){
    var flash = _register(payload.res);
    addFlash(flash);
  }

  if(payload.type === NotificationConstants.NOTIFICATION_CREATED &&
    RideStore.getState().currentUser.id === payload.notification.userId){

    state.notifications.push(payload.notification)

    setState({
      notifications: state.notifications
    });
  }
});

module.exports = NotificationStore;
