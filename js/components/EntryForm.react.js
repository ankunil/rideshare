/** @jsx React.DOM */

var React = require('react');

module.exports = EntryForm = React.createClass({

  propTypes: {
    registerHandler: React.PropTypes.func,
    signInHandler: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      isRegistering: false
    };
  },

  _registerUser: function(e){
    e.preventDefault();

    this.props.registerHandler();
  },

  _signInUser: function(e){
    e.preventDefault();

    this.props.signInHandler();
  },

  _toggleState: function(e){
    e.preventDefault();
    this.setState({
      isRegistering: !this.state.isRegistering
    });
  },

  render: function(){
    var emailField = (
      <div className="form-group">
        <label>Email:</label>
        <input type="text" className="form-control" name="email" id="input-email"></input>
      </div>
    );

    return(
      <div className="col-md-4 col-md-offset-4">
        <form onSubmit={ this.state.isRegistering ? this._registerUser : this._signInUser } id="entry-form">
          { this.state.isRegistering ? emailField : null }
          <div className="form-group">
            <label>Username:</label>
            <input type="text" className="form-control" name="username" id="input-username"></input>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" className="form-control" name="password" id="input-password"></input>
          </div>
          <button type="submit" className="btn btn-info">Submit</button>
          <a onClick={ this._toggleState } className="btn btn-default">
            { this.state.isRegistering ? "Sign In" : "Sign Up" }
          </a>
        </form>
      </div>
    );
  }
});
