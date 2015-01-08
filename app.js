/** @jsx React.DOM */

var React = require('react');
var RideTableApp = require('./js/components/RideTableApp.react');

React.render(
  <RideTableApp url="rides.json" pollInterval={2000} />, 
  document.getElementById('react-app')
);