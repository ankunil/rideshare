/** @jsx React.DOM */

var React = require('react');
var App = require('./js/components/App.react');
var EntryForm = require('./js/components/EntryForm.react');
var Rides = require('./js/components/jumbotron.react.js');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var routes = (
  <Route name="app" path="/" handler={ App }>
    <Route name="login" handler={ EntryForm }/>
    <Route name="signup" handler={ EntryForm }/>
    <Route name="rides" handler={ Rides }/>
    <DefaultRoute handler={ EntryForm } />
  </Route>
);

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.getElementById('react-app'));
});
