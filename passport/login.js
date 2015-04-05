var LocalStrategy   = require('passport-local').Strategy;
var models = require('../bookshelf/models');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
			models.User.forge({ username: username })
	    .fetch({ withRelated: ['rides', 'requests'] })
	    .then(function (user) {
				if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, req.flash('message', 'Invalid Password'));
        }
        return done(null, user); // maybe need to toJSON() here
	    })
	    .otherwise(function (err) {
				console.log(err);
				console.log('User not found.');
	      return done(err, false);
	    });
    })
  );

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }
}
