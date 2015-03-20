/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var RideRow = require('./RideRow.react');
var Jumbotron = require('./Jumbotron.react');
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

  _createRide: function(e){
    e.preventDefault();

    var destination = document.getElementById("input-destination").value;
    var spacesAvailable = document.getElementById("input-spaces").value;
    document.getElementById("ride-form").reset();
    var user = "bob";
    var ride = {
      destination: destination,
      spacesAvailable: spacesAvailable,
      user: user
    };
    JSON.stringify(ride);

    ViewActions.createRide(ride);
  },

  _deleteRide: function(e){
    e.preventDefault();
    alert("RIDE DELETED!");
    console.log("Ride Deleted!");
  },

  render: function(){
    var that = this;

    var rideNodes = this.state.rides.map(function(ride, index) {
      return(
        <RideRow
          destination={ ride.destination }
          user={ ride.user }
          spacesAvailable={ ride.spacesAvailable }
          url={ "/ride/" + ride._id }
          rideId={ ride._id }
          onClick= { that._deleteRide }>
        </RideRow>
      );
    });
    return (
      <div>
        <Jumbotron
          onSubmit={ this._createRide }>
        </Jumbotron>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Creator</th>
              <th>Spaces Available</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            { rideNodes }
          </tbody>
        </table>
      </div>
    );
  }
});
