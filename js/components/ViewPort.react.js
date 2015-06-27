/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


module.exports = ViewPort = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    createRideHandler: React.PropTypes.func
  },

  _formatTime: function(time){
    hoursAndMinutes = time.split(':');
    var leavingTime = new Date();
    leavingTime = leavingTime.toISOString().slice(0, 19).replace('T', ' ');
    // leavingTime.setHours(parseInt(hoursAndMinutes[0]));
    // leavingTime.setMinutes(parseInt(hoursAndMinutes[1]));
    return leavingTime;
  },

  _createRide: function(e){
    e.preventDefault();

    var ride = {
      destination: document.getElementById('input-destination').value,
      spacesAvailable: parseInt(document.getElementById('input-spaces').value),
      leavingAt: this._formatTime(document.getElementById('input-time').value),
      userId: this.props.currentUser.id
    };

    //format leavingAt value to datetime

    this.props.createRideHandler(ride);
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
    } else {
      viewportContent = (
        <span><Link to="/login">Click Here</Link> to sign in!</span>
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
