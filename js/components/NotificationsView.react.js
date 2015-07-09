/** @jsx React.DOM */

var React = require('react');
var NotificationStore = require('../stores/NotificationStore');

module.exports = NotificationsView = React.createClass({

  propTypes: {
    deleteNotificationHandler: React.PropTypes.func
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

  _deleteNotification: function(id){
    this.props.deleteNotificationHandler(id);
  },

  render: function(){
    var that = this;
    var notifications = (
      <p>
        You have no new notifications.
      </p>
    );

    if(this.state.notifications.length > 0){
      var notificationNodes = _.map(this.state.notifications, function(notification, index){
        return (
          <li className="list-group-item notification-item" onClick={ that._deleteNotification.bind(this, notification.id) }>
            { notification.message + " "} <span className="notification-delete pull-right">Delete</span>
          </li>
        );
      });

      notifications = (
        <ul className="list-group">
          { notificationNodes }
        </ul>
      );
    }

    return(
      <div className="container jumbotron">
        <div className="col-md-8">
          <h1>Notifications</h1>
          { notifications }
        </div>
      </div>
    );
  }
});
