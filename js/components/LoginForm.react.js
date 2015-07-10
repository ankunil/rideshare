/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

module.exports = LoginForm = React.createClass({

  mixins: [Router.Navigation],

  propTypes: {
    currentUser: React.PropTypes.object,
    signInHandler: React.PropTypes.func
  },

  componentWillUpdate: function(nextProps, nextState){
    if(!this.props.currentUser && nextProps.currentUser){
      this.transitionTo('/');
    }
  },

  _signInUser: function(e){
    e.preventDefault();

    var user = {
      username: document.getElementById('input-username').value,
      password: document.getElementById('input-password').value
    };

    this.props.signInHandler(user);
  },

  _navigateToRegister: function(e){
    e.preventDefault();
    this.transitionTo('/signup');
  },

  render: function(){
    return(
      <div className="col-md-4 col-md-offset-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title text-center">Sign In</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={ this._signInUser } id="entry-form">
              <div className="form-group">
                <label>Username:</label>
                <input type="text" className="form-control" name="username" id="input-username"></input>
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" className="form-control" name="password" id="input-password"></input>
              </div>
              <button type="submit" className="btn btn-info">Submit</button>
              <a onClick={ this._navigateToRegister } className="btn btn-default">Sign Up</a>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
