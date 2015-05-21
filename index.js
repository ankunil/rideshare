//=================EXPRESS SETUP======================

var express = require('express');
var exphbs  = require('express3-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var logger = require('morgan');
var passport = require('passport');
var expressSession = require('express-session');

var server = express();
var router = express.Router();

server.use(favicon());
server.use(logger('dev'));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use("/", express.static(__dirname + "/public/"));

// var hbs = exphbs.create({
//     defaultLayout: 'main',
// });
// server.engine('handlebars', hbs.engine);
// server.set('view engine', 'handlebars');

server.use(expressSession({secret: 'BananaStand'}));
server.use(passport.initialize());
server.use(passport.session());

var flash = require('connect-flash');
server.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

server.use(router);


//===============ROUTES=================

var models = require('./bookshelf/models');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
    console.log("User is authenticated");
		return next();
	}
	res.redirect('/');
}

// router.get('/', function(req, res) {
// 	res.render('login');
// });

//SOLUTION
//upon signing in or registering, sessionStorage.setItem("sessiontoken", req.session.passport.user.id)
//https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

router.post('/login',
  passport.authenticate('login'),
  function(req, res){
		console.log("session details:", req.session)
    console.log("authentication successful");
		delete req.user.attributes.password;
		console.log('user object', req.user);
  	res.json({ error: false, data: req.user.toJSON() });
  });

router.post('/signup',
  passport.authenticate('signup'),
  function(req, res){
    console.log("authentication successful");
		delete req.user.attributes.password;
    res.json({ error: false, data: req.user.toJSON() });
  });

router.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/');
});


//USER ROUTES
router.route('/users')
  .get(isAuthenticated, function (req, res) {
    models.Users.forge()
    .fetch()
    .then(function (users) {
			console.log("session details:", req.session)
      res.json({ error: false, data: users.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })

router.route('/users/:id')
  .get(function (req, res) {
    models.User.forge({ id: req.params.id })
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({ error: true, data: {} });
      }
      else {
        res.json({ error: false, data: user.toJSON() });
      }
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .delete(function (req, res) {
    models.User.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (user) {
      user.destroy()
      .then(function () {
        res.json({ error: true, data: { message: 'User successfully deleted' } });
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

//===============PORT=================

var port = process.env.PORT || 5000;
server.listen(port);
console.log("listening on " + port + "!");
