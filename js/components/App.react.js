/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var NavBar = require('./NavBar.react');
var FlashBar = require('./FlashBar.react');
var EntryForm = require('./EntryForm.react');
var RideStore = require('../stores/RideStore');
var ViewActions = require('../actions/ViewActions');
var RouteHandler = require('react-router').RouteHandler;

module.exports = App = React.createClass({

  mixins: [Router.Navigation],

  getInitialState: function() {
    ViewActions.checkForSession();
    ViewActions.loadRides();
    return RideStore.getState();
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    RideStore.removeChangeListener(this._onChange);
  },

  componentWillUpdate: function(nextProps, nextState){
    if(nextState.currentUser && !this.state.currentUser){
      this.transitionTo('/');
    }
    return true;
  },

  _onChange: function(){
    this.setState(RideStore.getState());
  },

  _registerUser: function(user){
    ViewActions.registerUser(user);
  },

  _signInUser: function(user){
    ViewActions.signInUser(user);
  },

  _createRequest: function(request){
    ViewActions.createRequest(request);
  },

  _createRide: function(ride){
    ViewActions.createRide(ride);
  },

  _deleteRide: function(id){
    ViewActions.deleteRide(id);
  },

  _deleteNotification: function(id){
    ViewActions.deleteNtf(id);
  },

  render: function(){
    return (
      <div>
        <NavBar
          currentUser={ this.state.currentUser }>
        </NavBar>
        <FlashBar></FlashBar>
        <RouteHandler
          currentUser={ this.state.currentUser }
          rides={ this.state.rides }
          signInHandler={ this._signInUser }
          registerHandler={ this._registerUser }
          createRideHandler={ this._createRide }
          deleteRideHandler={ this._deleteRide }
          createRequestHandler={ this._createRequest }
          deleteNotificationHandler={ this._deleteNotification }>
        </RouteHandler>
      </div>
    );
  }
});
