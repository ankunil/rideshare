/** @jsx React.DOM */

var React = require('react');

module.exports = Jumbotron = React.createClass({
  propTypes:{
    testHandler: React.PropTypes.func
  },

  _testFunc: function(){
    if(this.props.currentUser){
      alert("you have a current user! :)");
    } else {
      alert("you do not have a current user :(");
    }
    this.props.testHandler();
  },

  render: function(){
    return(
      <div className="container jumbotron">
        <div className="col-md-7">
          <h1>Rideshare</h1>
          <p>Save the environment and make new friends!</p>
          <button className="btn btn-warning" onClick={ this._testFunc }>
            Testing 123
          </button>
        </div>
      </div>
    );
  }
});
