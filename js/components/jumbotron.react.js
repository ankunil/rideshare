/** @jsx React.DOM */

var React = require('react');

module.exports = Jumbotron = React.createClass({
  render: function(){
    return(
      <div className="container jumbotron">
        <div className="col-md-7">
          <h1>Rideshare</h1>
          <p>Save the environment and make new friends!</p>
        </div>
        <div className="col-md-5">
          <form onSubmit= { this.props.onSubmit }>
            <div className="form-group">
              <label>Destination</label>
              <input type="text" className="form-control" id="input-destination" placeholder="e.g. Motomaki"></input>
            </div>
            <div className="form-group">
              <label>Seats Available</label>
              <input type="number" className="form-control" id="input-seats" placeholder="e.g. 3"></input>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Create</button>
          </form>
        </div>
      </div>
    );
  }
});
