/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var _ = require('lodash');
var EntryForm = require('./EntryForm.react');
var NavBar = require('./NavBar.react');
var RideStore = require('../stores/RideStore');
var ViewActions = require('../actions/ViewActions');
var RouteHandler = require('react-router').RouteHandler;

module.exports = App = React.createClass({

  mixins: [Router.Navigation],

  getInitialState: function() {
    ViewActions.checkForSession();
    return RideStore.getState();
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    RideStore.removeChangeListener(this._onChange);
  },

  componentWillUpdate: function(nextProps, nextState){
    if(nextState.currentUser && !!this.state.currentUser){
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

  _deleteRide: function(ride){
    ViewActions.deleteRide(ride);
  },

  _testFunc: function(){
    console.log("happy things happening");
  },

  render: function(){
    return (
      <div>
        <NavBar
          currentUser={ this.state.currentUser }>
        </NavBar>
        <RouteHandler
          currentUser={ this.state.currentUser }
          rides={ this.state.rides }
          testHandler={ this._testFunc }
          signInHandler={ this._signInUser }
          registerHandler={ this._registerUser }
          createRideHandler={ this._createRide }
          deleteRideHandler={ this._deleteRide }
          createRequestHandler={ this._createRequest }>
        </RouteHandler>
      </div>
    );
  }
});
