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

  _registerUser: function(user){
    ViewActions.registerUser(user);
  },

  _signInUser: function(user){
    ViewActions.signInUser(user);
  },

  _testFunc: function(){
    if(this.props.currentUser){
      alert("you have a current user! :)");
    } else {
      alert("you do not have a current user :(");
    }
  },

  render: function(){
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
          signInHandler={ this._signInUser }
          testHandler={ this._testFunc }>
        </RouteHandler>
      </div>
    );
  }
});
