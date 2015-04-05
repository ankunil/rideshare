/** @jsx React.DOM */

var React = require('react');

module.exports = RideRow = React.createClass({
  deleteRide: function(){
    this.props.deleteHandler(this.props.rideId);
  },

  createRequest: function(){
    this.props.requestHandler(this.props.rideId);
  },

  render: function(){
    return(
      <tr>
        <td>
          <h4>
            <a href={ this.props.url }>{ this.props.destination }</a>
          </h4>
        </td>

        <td>
          <h4>
            { this.props.user.username }
          </h4>
        </td>

        <td>
          <h4>
            { this.props.spacesAvailable }
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
