/** @jsx React.DOM */

var React = require('react');
var RideTableApp = require('./js/components/RideTableApp.react');

React.render(
  <RideTableApp />,
  document.getElementById('react-app')
);


var eventSrc = new EventSource('/rides/events');

eventSrc.addEventListener("ride", function(event) {
  var ride = JSON.parse(event.data);
  alert("client received data!");
  console.log(ride);
});
