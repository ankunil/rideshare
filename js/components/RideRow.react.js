/** @jsx React.DOM */

var React = require('react');
var CSSCore = require('react/lib/CSSCore');
var Router = require('react-router');
var Link = Router.Link;

module.exports = RideRow = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    if(this.props.ride.spacesAvailable === 0 && nextProps.rideReqs.length === 0){
      return false;
    }
    return true;
  },

  componentWillUpdate: function(nextProps, nextState){
    var that = this;

    if(nextProps.ride.spacesAvailable !== this.props.ride.spacesAvailable &&
       nextProps.ride.id === this.props.ride.id){
        window.setTimeout(function(){
          CSSCore.addClass(that.refs.tableRow.getDOMNode(), 'is-saved');
          window.setTimeout(function(){
            CSSCore.removeClass(that.refs.tableRow.getDOMNode(), 'is-saved');
          }, 3000);
        }, 100);
    }
  },

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
    var request = _.find(this.props.rideReqs, function(request){
      return request.userId === this.props.currentUser.id;
    }, this);
    this.props.deleteRequestHandler(request.id);
  },

  _formatTime: function(time){
    var formattedTime = new Date(time);
    formattedTime = formattedTime.toLocaleTimeString();
    return formattedTime.replace(':00', '');
  },

  _requestedByMe: function(rideReqs){
    var request = _.find(rideReqs, function(request){
      return request.userId === this.props.currentUser.id;
    }, this);

    return request ? true : false;
  },

  render: function(){
    var buttonNode;
    if(this.props.currentUser && this.props.ride.userId === this.props.currentUser.id) {
      buttonNode = (
        <td>
          <h4><span className="glyphicon glyphicon-remove-sign" onClick={ this._deleteRide }/> Delete</h4>
        </td>
      );
    } else if (this.props.currentUser && this._requestedByMe(this.props.rideReqs)){
      buttonNode = (
        <td>
          <h4><span className="glyphicon glyphicon-minus-sign" onClick={ this._deleteRequest }/> Unjoin</h4>
        </td>
      );
    } else if (this.props.currentUser && this.props.ride.spacesAvailable > 0){
      buttonNode = (
        <td>
          <h4><span className="glyphicon glyphicon-plus-sign" onClick={ this._createRequest }/> Join</h4>
        </td>
      );
    } else if (this.props.currentUser && this.props.ride.spacesAvailable === 0){
      buttonNode = (
        <td>
          <h4><span className="glyphicon glyphicon-ok-sign"/> Ride Filled</h4>
        </td>
      );
    }

    return(
      <tr ref="tableRow">
        <td>
          <h4><Link to={`/ride/${this.props.ride.id}`}>{ this.props.ride.destination }</Link></h4>
        </td>

        <td>
          <h4>{ this._formatTime(this.props.ride.leavingAt) }</h4>
        </td>

        <td>
          <h4>{ this.props.ride.user.username }</h4>
        </td>

        <td>
          <h4>{ this.props.ride.spacesAvailable > 0 ? this.props.ride.spacesAvailable : "-" }</h4>
        </td>

        { buttonNode }
      </tr>
    );
  }
});
