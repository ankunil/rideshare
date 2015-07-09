/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

module.exports = RideDetailView = React.createClass({

  mixins: [Router.State],

  propTypes: {
    rides: React.PropTypes.array,
    requests: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func,
    deleteRequestHandler: React.PropTypes.func
  },

  getInitialState: function(){
    var rideId = parseInt(this.getParams().id);

    return {
      rideId: rideId
    };
  },

  _formatTime: function(time){
    var formattedTime = new Date(time);
    formattedTime = formattedTime.toLocaleTimeString();
    return formattedTime.replace(':00', '');
  },

  render: function(){
    var users;
    var rideContent;
    var participants;
    var that = this;

    var ride = _.find(this.props.rides, function(ride){
      return ride.id === that.state.rideId;
    });

    ride ? users = _.pluck(this.props.requests[ride.id], 'user') : users = null;

    if(ride){
      rideContent = (
        <div>
          <h1>{ `Ride View: #${ride.id}` }</h1>
          <ul>
            <li>Destination: { ride.destination }</li>
            <li>Driver: { ride.user.username }</li>
            <li>Leaving At: { this._formatTime(ride.leavingAt) }</li>
            <li>Spaces Available: { ride.spacesAvailable }</li>
          </ul>
        </div>
      );
    } else {
      rideContent = (
        <h1>Ride View: </h1>
      );
    }

    if(users){
      participants = users.map(function(user, index){
        return (
          <li>Username: { user.username }</li>
        );
      });
    }

    return(
      <div className="container jumbotron">
        <div className="col-md-8">
          { rideContent }
        </div>
        <div className="col-md-4">
          <p>Riders</p>
          <ul>
            { participants }
          </ul>
        </div>
      </div>
    );
  }
});
