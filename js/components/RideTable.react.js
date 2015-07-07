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
    var that = this;
    var rideNodes = this.props.rides.map(function(ride, index) {
      return(
        <RideRow
          ride={ ride }
          rideReqs={ that.props.requests[ride.id] ? that.props.requests[ride.id] : []}
          currentUser= { that.props.currentUser }
          createRequestHandler={ that.props.createRequestHandler }
          deleteRequestHandler={ that.props.deleteRequestHandler }
          deleteRideHandler={ that.props.deleteRideHandler }>
        </RideRow>
      );
    });

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
