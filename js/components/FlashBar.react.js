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
    var flashNodes = _.map(this.state.flashes, function(flash, index){
      return (
        <div className="alert alert-success" role="alert">{ flash }</div>
      );
    });

    return(
      <div id="flash-bar">
      { flashNodes }
      </div>
    );
  }
});
