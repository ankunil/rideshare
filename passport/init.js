var login = require('./login');
var signup = require('./signup');
var User = require('../bookshelf/models').User;

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    console.log('serializing user:', user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.forge({ id: id })
    .fetch()
    .then(function (user) {
      console.log('deserializing user:', user);
      done(null, user);
    })
    .otherwise(function (err) {
      console.log(err);
      console.log('User not found, attempted to deserialize');
      done(err, false);
    });
  });

  login(passport);
  signup(passport);
}
