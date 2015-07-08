/** @jsx React.DOM */

var React = require('react');
var App = require('./js/components/App.react');
var EntryForm = require('./js/components/EntryForm.react');
var RidesView = require('./js/components/RidesView.react');
var RideDetailView = require('./js/components/RideDetailView.react');
var NotificationsView = require('./js/components/NotificationsView.react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var routes = (
  <Route name="app" path="/" handler={ App }>
    <Route name="login" handler={ EntryForm }/>
    <Route name="signup" handler={ EntryForm }/>
    <Route name="ride" path="ride/:id" handler={ RideDetailView }/>
    <Route name="notifications" path="notifications" handler={ NotificationsView }/>
    <DefaultRoute handler={ RidesView }/>
  </Route>
);

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.getElementById('react-app'));
});
