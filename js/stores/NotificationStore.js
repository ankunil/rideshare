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

function parseResBody(body) {
  console.log(body);
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

  if(payload.type === NotificationConstants.NOTIFICATION_CREATED){
    debugger;
    var timeStamp = Date.now();
    var newMessages = state.messages[timeStamp] = payload.body;

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

});

module.exports = NotificationStore;
