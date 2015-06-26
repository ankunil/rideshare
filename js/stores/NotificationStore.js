var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NotificationConstants = require('../constants/NotificationConstants');
var assign = require('object-assign');
var _ = require('lodash');

var events = new EventEmitter();

var CHANGE_EVENT = 'change';

var state = {
  messages: {}
};

function setState(newState) {
  assign(state, newState);
  events.emit(CHANGE_EVENT);
}

function addMessage(message){
  var timeStamp = Date.now();
  state.messages[timeStamp] = message;
  var newMessages = state.messages;

  setState({
    messages: newMessages
  });

  window.setTimeout(function(){
    if(state.messages[timeStamp]){
      delete state.messages[timeStamp];
      events.emit(CHANGE_EVENT);
    }
  }, 5000);
}

function parseError(res){
  if (res.status === 400){
    return 'Invalid form data. Please fill out all fields.'
  }

  //username already taken
  //email already taken

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
    return parseError(res.text);
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

  if(payload.type === NotificationConstants.CREATE_RIDE_NOTIFICATION){
    var message = _createRide(payload.res);
    addMessage(message);
  }

  if(payload.type === NotificationConstants.SIGN_IN_NOTIFICATION){
    var message = _signIn(payload.res);
    addMessage(message);
  }

  if(payload.type === NotificationConstants.REGISTER_NOTIFICATION){
    var message = _register(payload.res);
    addMessage(message);
  }
});

module.exports = NotificationStore;
