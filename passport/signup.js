var LocalStrategy   = require('passport-local').Strategy;
var User = require('../bookshelf/models').User;
var bCrypt = require('bcrypt-nodejs');

function createHash(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function validatePassword(password){
	if(password.length < 6) {
		console.log('Error in Saving user: password length too small.');
		return new Error('Password length must be at least 6 characters long.');
	}
}

function validateEmail(email){
	if(email.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/) === null){
		console.log('Error in Saving user: email format is incorrect.');
		return new Error('Invalid email format. Try username@rallydev.com.');
	}
}

function formatError(err, done){
	var error;
	var errorType = err.message.match(/(email_unique)|(username_unique)/)[0];
	if (errorType === 'username_unique'){
		error = new Error('A user already exists with that username.');
	} else if (errorType === 'email_unique'){
		error = new Error('That email address is already being used.');
	}
	console.log('FORMATTED ERRORTYPE:', errorType);
	return done(error, false);
}

module.exports = function(passport){
	passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {

			var emailError = validateEmail(req.body.email);
			var passwordError = validatePassword(req.body.password);

			if (emailError){
				return done(emailError, false);
			}

			if (passwordError) {
				return done(passwordError, false);
			}

			User.forge({
	      username: req.body.username,
	      email: req.body.email,
				password: createHash(req.body.password)
	    })
	    .save()
	    .then(function (user) {
				console.log('User Registration successful');
				return done(null, user);
	    })
	    .otherwise(function (err) {
				console.log('INSIDE FAIL BLOCK');
				console.log('Error in Saving user: '+ err);
				formatError(err, done);
			});
  	})
	);
}
