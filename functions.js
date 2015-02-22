var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'), //config file contains all tokens and other private info
    db = require('orchestrate')(config.db), //config.db holds Orchestrate token
    crypto = require('crypto');

function randomKey () {
  return crypto.randomBytes(10).toString('hex');
};

function getRide (key) {
  var deferred = Q.defer();

  db.get('rides', key)
  .then(function (response) {
    // get the ref out of the header
    var ref = response.headers.etag;

    deferred.resolve({
      ref: ref,
      data: response.body
    });
  })
  .fail(function (response) {
    console.log('get failed', response);
    deferred.reject(response);
  });

  return deferred.promise;
};

//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();
  var hash = bcrypt.hashSync(password, 8);
  var user = {
    "username": username,
    "password": hash,
  }

  var key = user.username
  //check if username is already assigned in our database
  db.get('local-users', username)
  .then(function (result){ //case in which user already exists in db
    console.log('username already exists');
    deferred.resolve(false); //username already exists
  })
  .fail(function (result) {//case in which user does not already exist in db
      console.log(result.body);
      if (result.body.message == 'The requested items could not be found.'){
        console.log('Username is free for use');
        db.put('local-users', key, user)
        .then(function () {
          console.log("USER: " + user);
          deferred.resolve(user);
        })
        .fail(function (err) {
          console.log("PUT FAIL:" + err.body);
          deferred.reject(new Error(err.body));
        });
      } else {
        deferred.reject(new Error(result.body));
      }
  });

  return deferred.promise;
};


exports.createRide = function(ride, user) {
  var deferred = Q.defer();

  var key = randomKey();
  ride.user = user.username;

  ride.dateCreated = new Date().toISOString();
  ride.dateUpdated = new Date().toISOString();

  db.put('rides', key, ride, false)
  .then(function () {
    console.log('create relationship');
    console.log('username:', user.username);
    console.log('rides', key);

    return db.newGraphBuilder()
    .create()
    .from('local-users', user.username)
    .related('creator')
    .to('rides', key);

  })
  .then(function () {
    console.log('ride and relationship created');
    deferred.resolve(ride);
  })
  .fail(function () {
    console.log('new ride failed');
    deferred.reject();
  });

  return deferred.promise;
};


exports.getRide = function (key) {
  return getRide(key);
};

exports.deleteRide = function (key, user) {
  return getRide(key)
  .then(function (response) {
    if (response.data.user !== user.username) {
      throw new Error('user not owner');
    }
  })
  .then(function (response) {
    return db.remove('rides', key);
  });
};


exports.getRides = function(){
  var deferred = Q.defer();

  db.list('rides')
  .then(function (response) {
    // console.log(response.body);
    var rides = response.body.results || [];
    return {
      rides: rides
    };
  })
  .then(function (response) {
    deferred.resolve(response);
  })
  .fail(function (response) {
    console.log('search failed', response);
    deferred.reject(response);
  });

  return deferred.promise;
};


//check if user exists
exports.localAuth = function (username, password) {
  var deferred = Q.defer();

  db.get('local-users', username)
  .then(function (result){
    console.log("FOUND USER");
    var hash = result.body.password;
    console.log(hash);
    console.log(bcrypt.compareSync(password, hash));
    if (bcrypt.compareSync(password, hash)) {
      deferred.resolve(result.body);
    } else {
      console.log("PASSWORDS NOT MATCH");
      deferred.resolve(false);
    }
  }).fail(function (err){
    if (err.body.message == 'The requested items could not be found.'){
          console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
          deferred.resolve(false);
    } else {
      deferred.reject(new Error(err));
    }
  });

  return deferred.promise;
}
