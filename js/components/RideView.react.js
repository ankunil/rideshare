/** @jsx React.DOM */

var React = require('react');
var RideTable = require('./RideTable.react');
var ViewPort = require('./ViewPort.react');

module.exports = RideView = React.createClass({

  propTypes: {
    rides: React.PropTypes.array,
    currentUser: React.PropTypes.object,
    createRideHandler: React.PropTypes.func,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func
  },

  render: function(){
    return(
      <div>
        <ViewPort
          currentUser={ this.props.currentUser }
          createRideHandler={ this.props.createRideHandler }>
        </ViewPort>
        <RideTable
          rides={ this.props.rides }
          currentUser={ this.props.currentUser }
          deleteRideHandler={ this.props.deleteRideHandler }
          createRequestHandler={ this.props.createRequestHandler }>
        </RideTable>
      </div>
    );
  }
});
