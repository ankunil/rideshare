/** @jsx React.DOM */

var React = require('react');
var TestApp = require('./js/components/TestApp.react');

React.render(
  <TestApp/>, 
  document.getElementById('react-app')
);