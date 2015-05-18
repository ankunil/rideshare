/** @jsx React.DOM */

var React = require('react');

module.exports = NavBar = React.createClass({
  render: function(){
    return(
      <nav className="navbar navbar-default" role="navigation">
        <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li>User Info Should Go Here</li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
