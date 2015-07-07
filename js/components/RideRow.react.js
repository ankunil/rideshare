/** @jsx React.DOM */

var React = require('react');

module.exports = RideRow = React.createClass({
  _deleteRide: function(){
    this.props.deleteRideHandler(this.props.ride.id);
  },

  _createRequest: function(){
    var request = {
      userId: this.props.currentUser.id,
      rideId: this.props.ride.id
    };
    this.props.createRequestHandler(request);
  },

  _deleteRequest: function(){
    var that = this;
    var request = _.find(this.props.rideReqs, function(request){
      return request.userId === that.props.currentUser.id;
    });
    this.props.deleteRequestHandler(request.id);
  },

  _formatTime: function(time){
    var formattedTime = new Date(time);
    formattedTime = formattedTime.toLocaleTimeString();
    return formattedTime.replace(':00', '');
  },

  _hasBeenRequested: function(){
    var hasBeenRequested = false;
    var that = this;
    var request = _.find(this.props.rideReqs, function(request){
      return request.userId === that.props.currentUser.id;
    });

    request ? hasBeenRequested = true : null;
    return hasBeenRequested;
  },

  render: function(){
    var buttonNode;
    if(this.props.currentUser && this.props.ride.userId === this.props.currentUser.id) {
      buttonNode = (
        <td>
          <h4>Delete <span className="glyphicon glyphicon-remove" onClick={ this._deleteRide }/></h4>
        </td>
      );
    } else if (this.props.currentUser && this._hasBeenRequested()){
      buttonNode = (
        <td>
          <h4>Unjoin <span className="glyphicon glyphicon-remove" onClick={ this._deleteRequest }/></h4>
        </td>
      );
    } else if (this.props.currentUser){
      buttonNode = (
        <td>
          <h4>Join <span className="glyphicon glyphicon-plus" onClick={ this._createRequest }/></h4>
        </td>
      );
    }

    return(
      <tr>
        <td>
          <h4><a href="fakeurl">{ this.props.ride.destination }</a></h4>
        </td>

        <td>
          <h4>{ this._formatTime(this.props.ride.leavingAt) }</h4>
        </td>

        <td>
          <h4>{ this.props.ride.user.username }</h4>
        </td>

        <td>
          <h4>{ this.props.ride.spacesAvailable }</h4>
        </td>

        { buttonNode }
      </tr>
    );
  }
});
