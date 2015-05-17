/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var EntryForm = require('./EntryForm.react.js');
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

  _registerUser: function(e){
    // e.preventDefault();

    var user = {
      email: document.getElementById('input-email').value,
      username: document.getElementById('input-username').value,
      password: document.getElementById('input-password').value
    };

    ViewActions.registerUser(JSON.stringify(user));
  },

  _signInUser: function(e){
    e.preventDefault();

    var user = {
      username: document.getElementById('input-username').value,
      password: document.getElementById('input-password').value
    };

    ViewActions.signInUser(JSON.stringify(user));
  },

  render: function(){
    if(this.state.currentUser.username){
      console.log("you win, son:", this.state.currentUser);
      return(<span>Fuck yeah</span>);
    }

    return (
      <div>
        <EntryForm
          registerHandler={ this._registerUser }
          signInHandler={ this._signInUser }>
        </EntryForm>
      </div>
    );
  }
});
