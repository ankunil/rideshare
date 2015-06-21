/** @jsx React.DOM */

var React = require('react');
var NotificationStore = require('../stores/NotificationStore');

module.exports = FlashBar = React.createClass({

  getInitialState: function() {
    return NotificationStore.getState();
  },

  componentDidMount: function() {
    NotificationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    NotificationStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(NotificationStore.getState());
  },

  render: function(){
    //map over every message and return a new alert for each one

    var messages = '';
    if(this.state.messages.length > 0){
      messages = this.state.messages[0];
    }

    return(
      <div class="alert alert-success" role="alert">{ messages }</div>
    );
  }
});
