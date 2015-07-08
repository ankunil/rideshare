/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

module.exports = RideDetailView = React.createClass({

  mixins: [Router.State],

  propTypes: {
    rides: React.PropTypes.array,
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
    var rideContent;
    var that = this;

    var ride = _.find(this.props.rides, function(ride){
      return ride.id === that.state.rideId;
    });

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

    return(
      <div className="container jumbotron">
        <div className="col-md-8">
          { rideContent }
        </div>
      </div>
    );
  }
});
