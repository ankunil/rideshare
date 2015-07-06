/** @jsx React.DOM */

var React = require('react');
var App = require('./js/components/App.react');
var EntryForm = require('./js/components/EntryForm.react');
var RideView = require('./js/components/RideView.react');
var NotificationsView = require('./js/components/NotificationsView.react');
var Rides = require('./js/components/jumbotron.react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var routes = (
  <Route name="app" path="/" handler={ App }>
    <Route name="login" handler={ EntryForm }/>
    <Route name="signup" handler={ EntryForm }/>
    <Route name="ride" path="ride/:id" handler={ RideView }/>
    <Route name="notifications" path="notifications" handler={ NotificationsView }/>
    <DefaultRoute handler={ RideView }/>
  </Route>
);

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.getElementById('react-app'));
});
