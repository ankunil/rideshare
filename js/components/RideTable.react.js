/** @jsx React.DOM */

var React = require('react');
var RideRow = require('./RideRow.react');

module.exports = RideTable = React.createClass({

  propTypes: {
    rides: React.PropTypes.array,
    requests: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func,
    deleteRequestHandler: React.PropTypes.func
  },

  render: function(){
    var rideNodes = this.props.rides.map(function(ride, index) {
      return(
        <RideRow
          ride={ ride }
          rideReqs={ this.props.requests[ride.id] ? this.props.requests[ride.id] : []}
          currentUser= { this.props.currentUser }
          createRequestHandler={ this.props.createRequestHandler }
          deleteRequestHandler={ this.props.deleteRequestHandler }
          deleteRideHandler={ this.props.deleteRideHandler }>
        </RideRow>
      );
    }.bind(this));

    return(
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Leaving At</th>
            <th>Driver</th>
            <th>Seats Available</th>
          </tr>
        </thead>
        <tbody>
          { rideNodes }
        </tbody>
      </table>
    );
  }
});
