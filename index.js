var express = require('express'),
    exphbs  = require('express3-handlebars'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    FacebookStrategy = require('passport-facebook');    

var config = require('./config.js'), //config file contains all tokens and other private info
    funct = require('./functions.js'),
    fs = require('fs'),
    bodyParser = require('body-parser');

var app = express();

//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}


//===============EXPRESS=================

// Configure Express
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'supernova' }));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

app.use(app.router);

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//===============ROUTES=================

app.get('/',  function(req, res){
  res.redirect('/rides');
});

//displays our signup page
app.get('/signin', function(req, res){
  res.render('./signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

app.use("/", express.static(__dirname + "/public/"));


// ------------------------------------------------------------
// ALL RIDES
// ------------------------------------------------------------

// var rides = JSON.parse(fs.readFileSync('_rides.json'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/rides.json', function(req, res) {
  funct.getRides()
  .then(function (response) {
    res.send(response.rides)
  })
  .fail(function () {
    console.log('get rides error', res);
    res.render('error');
  });
});

app.get('/rides', function(req, res){
  funct.getRides()
  .then(function (response) {
    res.render('rides', {
      user: req.user
    });
  })
  .fail(function () {
    console.log('get rides error', res);
    res.render('error');
  });
});


app.get('/rides/create', ensureAuthenticated, function(req, res){
  res.render('create', {user: req.user});
});


app.post('/rides/create', ensureAuthenticated, function(req, res){
  var ride = {
    destination: req.body.destination,
    spacesAvailable: parseInt(req.body.spacesAvailable)
  };

  funct.createRide(ride, req.user)
  .then(function () {
    req.session.success = 'Ride Created!';
    res.redirect('/rides');
  })
  .fail(function () {
    req.session.error = 'Ride failed to be created.';
    res.redirect('/rides');
  });
});

// ------------------------------------------------------------
// SINGLE RIDE
// ------------------------------------------------------------

app.get('/ride/:id',  function(req, res){
  funct.getRide(req.params.id)
  
  .then(function (response) {
    res.render('ride', {
      ride: response.data,
      key: req.params.id,
      user: req.user
    });
  })
  .fail(function () {
    console.log('get ride error', res);
    res.render('error', { user: req.user });
  });
});


app.get('/ride/:id/delete', ensureAuthenticated, function(req, res){
  funct.deleteRide(req.params.id, req.user)

  .then(function (response) {
    req.session.success = 'Ride deleted';
    res.redirect('/rides')
  })
  .fail(function () {
    req.session.error = 'Couldn\'t delete ride';
    res.redirect('/rides');
  });
});


//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});


//===============PORT=================
var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");