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

    var notificationNodes = _.map(this.state.notifications, function(notification, index){
      return (
        <li className="list-group-item">
          { notification.message + " "}
          <span className="glyphicon glyphicon-remove" onClick={ that._deleteNotification.bind(this, notification.id) }/>
        </li>
      );
    });

    return(
      <div className="container jumbotron">
        <div className="col-md-8">
          <h1>Notifications</h1>
          <ul className="list-group">
            { notificationNodes }
          </ul>
        </div>
      </div>
    );
  }
});
