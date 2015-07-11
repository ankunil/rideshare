/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var NotificationStore = require('../stores/NotificationStore');
var Link = Router.Link;

module.exports = NavBar = React.createClass({

  mixins: [Router.Navigation],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState: function() {
    return NotificationStore.getState();
  },

  componentDidMount: function() {
    NotificationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    NotificationStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(NotificationStore.getState());
  },

  _navigateToNotifications: function(e){
    e.preventDefault();
    this.transitionTo('/notifications');
  },

  render: function(){
    var navContent;
    var ntfCountBadge;
    var ntfCount = 0

    _.each(this.state.notifications, function(ntf){
      ntf.seen === false ? ntfCount += 1 : null;
    });

    if(ntfCount > 0){
      ntfCountBadge = (<span className="badge">{ ntfCount }</span>)
    }

    if(this.props.currentUser){
      navContent = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="" onClick={ this._navigateToNotifications }>
              Notifications <span id="notification-icon" className="glyphicon glyphicon-bell"/> { ntfCountBadge }
            </a>
          </li>
          <li><a href="/signout">Sign Out</a></li>
        </ul>
      );
    } else {
      navContent = (
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="/login">Sign In</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
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
