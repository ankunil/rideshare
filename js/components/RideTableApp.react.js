/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var RideRow = require('./RideRow.react');
var Q = require('q');

module.exports = RideTableApp = React.createClass({
  render: function(){
    var rideNodes = this.state.data.map(function(ride, index) {
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
  },
  loadRidesFromServer: function() {
    $.ajax({
      url: "/rides.json",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadRidesFromServer();
    setInterval(this.loadRidesFromServer, this.props.pollInterval);
  }
});