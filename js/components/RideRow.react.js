/** @jsx React.DOM */

var React = require('react');

module.exports = RideRow = React.createClass({
  render: function(){
    return(
      <tr>
        <td>
          <h4>
            <a href={this.props.url}>{this.props.destination}</a>
          </h4>
        </td>
        
        <td>
          <h4>
            {this.props.user}
          </h4>
        </td>
        
        <td>
          <h4>
            {this.props.spacesAvailable}
          </h4> 
        </td>
      </tr>
    );
  }
});