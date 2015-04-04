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
    console.log(e);

    var destination = document.getElementById("input-destination").value;
    var spacesAvailable = document.getElementById("input-spaces").value;
    document.getElementById("ride-form").reset();

    var ride = {
      destination: destination,
      spacesAvailable: spacesAvailable,
      user_id: 1
    };
    JSON.stringify(ride);

    ViewActions.createRide(ride);
  },

  _deleteRide: function(id){
    ViewActions.deleteRide(id);
  },

  _createRequest: function(id){
    var request = {
      user_id: 2,
      ride_id: id
    }
    JSON.stringify(request);
    ViewActions.createRequest(request);
  },

  render: function(){
    var that = this;
    var rideNodes = this.state.rides.map(function(ride, index) {
      return(
        <RideRow
          destination={ ride.destination }
          spacesAvailable={ ride.spacesAvailable }
          url={ "/ride/" + ride.id }
          rideId={ ride.id }
          requestHandler={ that._createRequest }
          deleteHandler={ that._deleteRide }>
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
              <th>Interact</th>
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
