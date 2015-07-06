var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NotificationConstants = require('../constants/NotificationConstants');
var ViewActions = require('../actions/ViewActions');
var assign = require('object-assign');
var RideStore = require('./RideStore.js');
var _ = require('lodash');

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
  },

  _sseNewNotification: function(event){
    console.log('RECEIVED SSE EVENT');
    var newNotification = JSON.parse(event.data);
    var notificationIds = _.pluck(state.notifications, 'id');
    var containNotification = _.contains(notificationIds, newNotification.id);

    if(!containNotification){
      ViewActions.loadNtfs(RideStore.getState().currentUser.id);
    }
  },

  _createEventSources: function(){
    var eventSrc = new EventSource('/notifications/events');
    eventSrc.addEventListener('newNotification', this._sseNewNotification);
  },

};
NotificationStore._createEventSources();

NotificationStore.dispatchToken = AppDispatcher.register(function(payload){
  // console.log('notification store payload:', payload);

  if(payload.type === NotificationConstants.CREATE_RIDE_FLASH){
    addFlash(_createRide(payload.res));
  }

  if(payload.type === NotificationConstants.SIGN_IN_FLASH){
    addFlash(_signIn(payload.res));
  }

  if(payload.type === NotificationConstants.REGISTER_FLASH){
    addFlash(_register(payload.res));
  }

  if(payload.type === NotificationConstants.NOTIFICATION_CREATED &&
    RideStore.getState().currentUser.id === payload.notification.userId){

    state.notifications.push(payload.notification)

    setState({
      notifications: state.notifications
    });
  }

  if(payload.type === NotificationConstants.NOTIFICATIONS_LOADED){
    setState({
      notifications: payload.notifications
    });
  }

  if(payload.type === NotificationConstants.NOTIFICATION_DELETED){
    var filteredNotifications = state.notifications.filter(function(obj){
      return obj.id !== payload.id
    });
    setState({
      notifications: filteredNotifications
    });
  }
});

module.exports = NotificationStore;
