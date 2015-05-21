/** @jsx React.DOM */

var React = require('react');

module.exports = Jumbotron = React.createClass({
  render: function(){
    return(
      <div className="container jumbotron">
        <div className="col-md-7">
          <h1>Rideshare</h1>
          <p>Save the environment and make new friends!</p>
        </div>
      </div>
    );
  }
});
