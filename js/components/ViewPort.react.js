/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var ServerActions = require('../actions/ServerActions');
var Link = Router.Link;

module.exports = ViewPort = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    createRideHandler: React.PropTypes.func
  },

  _createRide: function(e){
    e.preventDefault();

    var destination = document.getElementById('input-destination').value;
    var spacesAvailable = document.getElementById('input-spaces').value;
    var leavingAt = document.getElementById('input-time').value;

    if (destination && spacesAvailable && leavingAt){
      var ride = {
        destination: destination,
        spacesAvailable: parseInt(spacesAvailable),
        leavingAt: new Date('April 5, 2015 ' + leavingAt),
        userId: this.props.currentUser.id
      };
      this.props.createRideHandler(ride);
      document.getElementById('ride-form').reset();
    } else {
      ServerActions.createRideFlash({status: 400, error: true});
    }
  },

  render: function(){
    var viewportContent;
    if(this.props.currentUser){
      viewportContent = (
        <form onSubmit={ this._createRide } id="ride-form">
          <div className="form-group">
            <label>Destination:</label>
            <input type="text" className="form-control" name="destination" id="input-destination"></input>
          </div>
          <div className="form-group">
            <label>Spaces Available:</label>
            <input type="number" className="form-control" name="spacesAvailable" id="input-spaces"></input>
          </div>
          <div className="form-group">
            <label>Leaving At:</label>
            <input type="time" className="form-control" name="leavingAt" id="input-time"></input>
          </div>
          <button type="submit" className="btn btn-info">Submit</button>
        </form>
      );
    }

    return(
      <div className="container jumbotron">
        <div className="col-md-8">
          <h1>Rideshare</h1>
          <p>Save the environment and make new friends!</p>
        </div>
        <div className="col-md-4">
          { viewportContent }
        </div>
      </div>
    );
  }
});

//viewport has what views?
// not signed in prompt to sign in
// signed in is a form to create
// clicked on a ride shows ride detail view
// ^ create a separate component and use transition to to navigate
// navigate mixin needed.
