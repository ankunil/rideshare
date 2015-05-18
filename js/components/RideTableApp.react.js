/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var EntryForm = require('./EntryForm.react.js');
var NavBar = require('./NavBar.react.js');
var RideStore = require('../stores/RideStore');
var ViewActions = require('../actions/ViewActions');

module.exports = RideTableApp = React.createClass({

  getInitialState: function() {
    return RideStore.getState();
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
    // ViewActions.loadRides(); is this really necessary if we're getting state?
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
    if(this.state.currentUser.username){
      console.log("you authenticated, dawg:", this.state.currentUser);
      return(<span>Such Auth</span>);
    }

    return (
      <div>
        <NavBar/>
        <EntryForm
          registerHandler={ this._registerUser }
          signInHandler={ this._signInUser }>
        </EntryForm>
      </div>
    );
  }
});
