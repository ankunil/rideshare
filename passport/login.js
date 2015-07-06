var LocalStrategy = require('passport-local').Strategy;
var User = require('../bookshelf/models').User;
var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.attributes.password);
}

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
			User.forge({ username: req.body.username })
	    .fetch({ withRelated: ['notifications'] })
	    .then(function (user) {
				if (!isValidPassword(user, req.body.password)){
          console.log('Invalid Password');
          return done(null, false, req.flash('message', 'Invalid Password'));
        }
        return done(null, user);
	    })
	    .otherwise(function (err) {
				console.log(err);
				console.log('User not found.');
	      return done(err, false);
	    });
    })
  );
}
