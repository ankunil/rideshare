/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var ViewActions = require('../actions/ViewActions');
var RideStore = require('../stores/RideStore');

module.exports = RideDetailView = React.createClass({

  mixins: [Router.State, Router.Navigation],

  propTypes: {
    currentUser: React.PropTypes.object,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func,
    deleteRequestHandler: React.PropTypes.func
  },

  getInitialState: function(){
    return RideStore.getRideState(parseInt(this.getParams().id));
  },

  componentDidMount: function() {
    RideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    RideStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(RideStore.getRideState(parseInt(this.getParams().id)));
  },

  shouldComponentUpdate: function(nextProps, nextState){
    if(this.props.currentUser && this._requestedByMe(this.state.rideReqs) && !this._requestedByMe(nextState.rideReqs)){
      return false;
    }
    return true;
  },

  _deleteRide: function(){
    this.props.deleteRideHandler(parseInt(this.getParams().id));
    this.transitionTo('/');
  },

  _createRequest: function(){
    var request = {
      userId: this.props.currentUser.id,
      rideId: parseInt(this.getParams().id)
    };
    this.props.createRequestHandler(request);
  },

  _deleteRequest: function(){
    var that = this;
    var request = _.find(this.state.rideReqs, function(request){
      return request.userId === that.props.currentUser.id;
    });
    this.props.deleteRequestHandler(request.id);
  },

  _formatTime: function(time){
    var formattedTime = new Date(time);
    formattedTime = formattedTime.toLocaleTimeString();
    return formattedTime.replace(':00', '');
  },

  _requestedByMe: function(rideReqs){
    var that = this;
    var request = _.find(rideReqs, function(request){
      return request.userId === that.props.currentUser.id;
    });

    return request ? true : false;
  },

  render: function(){
    var that = this;
    var users;
    var rideContent;
    var participants;
    var buttonNode;
    var ride = this.state.ride;

    if(ride){
      users = _.pluck(this.state.rideReqs, 'user');

      if(this.props.currentUser && ride.userId === this.props.currentUser.id) {
        buttonNode = (
          <span className="btn btn-danger" onClick={ this._deleteRide }>Delete</span>
        );
      } else if (this.props.currentUser && this._requestedByMe(this.state.rideReqs)){
        buttonNode = (
          <span className="btn btn-danger" onClick={ this._deleteRequest }>Unjoin</span>
        );
      } else if (this.props.currentUser && ride.spacesAvailable > 0){
        buttonNode = (
          <span className="btn btn-success" onClick={ this._createRequest }>Join</span>
        );
      } else if (this.props.currentUser && ride.spacesAvailable === 0){
        buttonNode = (
          <span className="btn btn-default">Ride Filled</span>
        );
      }

      rideContent = (
        <div>
          <h1>{ `${ride.destination} bound.` }</h1>
            <h3>{ ride.user.username } is leaving at { this._formatTime(ride.leavingAt) }.</h3>
            <h4>Spaces Available: { ride.spacesAvailable }</h4>
            { buttonNode }
        </div>
      );

      if(users){
        participants = users.map(function(user, index){
          return (
            <li>Username: { user.username }</li>
          );
        });
      }
    }

    return(
      <div className="container jumbotron">
        <div className="col-md-9">
          { rideContent }
        </div>
        <div className="col-md-3">
          <p>Riders</p>
          <ul>
            { participants }
          </ul>
        </div>
      </div>
    );
  }
});
