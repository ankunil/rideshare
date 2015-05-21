/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var EntryForm = require('./EntryForm.react.js');
var NavBar = require('./NavBar.react.js');
var RideStore = require('../stores/RideStore');
var ViewActions = require('../actions/ViewActions');
var RouteHandler = require('react-router').RouteHandler;

module.exports = App = React.createClass({

  getInitialState: function() {
    return RideStore.getState();
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    RideStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(RideStore.getState());
  },

  _registerUser: function(){
    var user = {
      email: document.getElementById('input-email').value,
      username: document.getElementById('input-username').value,
      password: document.getElementById('input-password').value
    };

    ViewActions.registerUser(user);
  },

  _signInUser: function(){
    var user = {
      username: document.getElementById('input-username').value,
      password: document.getElementById('input-password').value
    };

    ViewActions.signInUser(user);
  },

  render: function(){
    var appBody;
    if(this.state.currentUser.id){
      console.log("you authenticated, dawg:", this.state.currentUser);
      appBody = (<span>Such Auth</span>);
    } else {
      appBody = (
        <EntryForm
          registerHandler={ this._registerUser }
          signInHandler={ this._signInUser }>
        </EntryForm>
      );
    }

    // HASH CHANGE http://stackoverflow.com/questions/2161906/handle-url-anchor-change-event-in-js
    // the only thing I don't think we get is going back and forth - we might lose the currentUser
    // we need to figure out how to grab the user from the session.

    //we need something that's polling for input changes and then tells the app what to render

    return (
      <div>
        <NavBar
          currentUser={ this.state.currentUser }>
        </NavBar>
        <RouteHandler
          currentUser={ this.state.currentUser }
          signInHandler={ this._signInUser }>
        </RouteHandler>
      </div>
    );
  }
});
