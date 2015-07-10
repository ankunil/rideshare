/** @jsx React.DOM */

var React = require('react');
var RideTable = require('./RideTable.react');
var ViewPort = require('./ViewPort.react');
var ViewActions = require('../actions/ViewActions');
var RideStore = require('../stores/RideStore');

module.exports = RidesView = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    createRideHandler: React.PropTypes.func,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func,
    deleteRequestHandler: React.PropTypes.func
  },

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

  render: function(){
    return(
      <div>
        <ViewPort
          currentUser={ this.props.currentUser }
          createRideHandler={ this.props.createRideHandler }>
        </ViewPort>
        <RideTable
          rides={ this.state.rides }
          requests={ this.state.requests }
          currentUser={ this.props.currentUser }
          deleteRideHandler={ this.props.deleteRideHandler }
          createRequestHandler={ this.props.createRequestHandler }
          deleteRequestHandler={ this.props.deleteRequestHandler }>
        </RideTable>
      </div>
    );
  }
});
