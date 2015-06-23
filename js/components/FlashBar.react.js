/** @jsx React.DOM */

var _ = require('lodash');
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
    var messageNodes = _.map(this.state.messages, function(message, index){
      return (
        <div className="alert alert-success" role="alert">{ message }</div>
      );
    });

    return(
      <div>
      { messageNodes }
      </div>
    );
  }
});
