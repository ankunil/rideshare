/** @jsx React.DOM */

var React = require('react');

module.exports = NavBar = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.object
  },

  render: function(){
    var navContent;
    if(this.props.currentUser.id){
      navContent = (
        <ul className="nav navbar-nav">
          <li><a href="/signout">Sign Out</a></li>
        </ul>
      );
    }

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
            { navContent }
          </div>
        </div>
      </nav>
    );
  }
});
