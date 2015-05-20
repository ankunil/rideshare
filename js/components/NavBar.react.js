/** @jsx React.DOM */

var React = require('react');

module.exports = NavBar = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.object
  },

  render: function(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Rideshare</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              { this.props.currentUser.id ? <li><a href="/signout">Sign Out</a></li> : null }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
