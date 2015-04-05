var login = require('./login');
var signup = require('./signup');
var models = require('../bookshelf/models');

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    console.log('serializing user: ');console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.forge({ id: id })
    .fetch({ withRelated: ['rides', 'requests'] })
    .then(function (user) {
      console.log('deserializing user:', user);
      done(null, user); // maybe need to toJSON() here
    })
    .otherwise(function (err) {
      console.log(err);
      console.log('User not found.');
      done(err, false);
    });
  });

  login(passport);
  signup(passport);
}
