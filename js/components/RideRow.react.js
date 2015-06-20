/** @jsx React.DOM */

var React = require('react');

module.exports = RideRow = React.createClass({
  deleteRide: function(){
    this.props.deleteRideHandler(this.props.ride.id);
  },

  createRequest: function(){
    this.props.createRequestHandler(this.props.ride.id);
  },

  render: function(){
    return(
      <tr>
        <td>
          <h4>
            <a href="fakeurl">{ this.props.ride.destination }</a>
          </h4>
        </td>

        <td>
          <h4>
            { this.props.ride.user ? this.props.ride.user.username : 'null' }
          </h4>
        </td>

        <td>
          <h4>
            { this.props.ride.spacesAvailable }
          </h4>
        </td>

        <td>
          <h4>
          <span className="glyphicon glyphicon-plus" onClick={ this.createRequest }></span>
          </h4>
        </td>

        <td>
          <h4>
            <span className="glyphicon glyphicon-remove" onClick={ this.deleteRide }></span>
          </h4>
        </td>
      </tr>
    );
  }
});
