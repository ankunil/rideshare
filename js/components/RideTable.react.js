/** @jsx React.DOM */

var React = require('react');
var RideRow = require('./RideRow.react');

module.exports = RideTable = React.createClass({

  propTypes: {
    rides: React.PropTypes.array,
    currentUser: React.PropTypes.object,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func
  },

  render: function(){
    var that = this;
    var rideNodes = this.props.rides.map(function(ride, index) {
      return(
        <RideRow
          ride={ ride }
          currentUser = { that.props.currentUser }
          createRequestHandler={ that.props.createRequestHandler }
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
            <th>{ this.props.currentUser ? "Remove" : "Interact" }</th>
          </tr>
        </thead>
        <tbody>
          { rideNodes }
        </tbody>
      </table>
    );
  }
});
