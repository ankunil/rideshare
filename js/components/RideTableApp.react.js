/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var RideRow = require('./RideRow.react');
var RideStore = require('../stores/RideStore');
var ViewActions = require('../actions/ViewActions');

module.exports = RideTableApp = React.createClass({

  getInitialState: function() {
    return RideStore.getState();
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
    ViewActions.loadRides();
  },

  componentWillUnmount: function(){
    RideStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(RideStore.getState());
  },

  render: function(){
    var rideNodes = this.state.rides.map(function(ride, index) {
      return(
        <RideRow
          destination={ ride.value.destination }
          user={ ride.value.user }
          spacesAvailable={ride.value.spacesAvailable }
          url={ "/ride/" + ride.path.key }>
        </RideRow>
      );
    });
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Creator</th>
            <th>Spaces Available</th>
          </tr>
        </thead>
        <tbody>
          {rideNodes}
        </tbody>
      </table>
    );
  }
});
