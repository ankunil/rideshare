//==============SSE SETUP================

function RideEmitter() {
  this.basket = []; //does not matter
}
require("util").inherits(RideEmitter, require("events").EventEmitter);

RideEmitter.prototype.newRide = function(ride) {
  this.emit("newRide", ride);
};

RideEmitter.prototype.updateRide = function(ride) {
  this.emit("updateRide", ride);
};

RideEmitter.prototype.deleteRide = function(id) {
  this.emit("deleteRide", id);
};

var rideEmitter = new RideEmitter();

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

var hbs = exphbs.create({
    defaultLayout: 'main',
});
server.engine('handlebars', hbs.engine);
server.set('view engine', 'handlebars');

server.use(expressSession({secret: 'BananaStand'}));
server.use(passport.initialize());
server.use(passport.session());

var flash = require('connect-flash');
server.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

server.use(router);

// var routes = require('./routes/index')(passport); // could keep routes here
// server.use('/', routes);


//===============ROUTES=================

var models = require('./bookshelf/models');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
    console.log("User is authenticated");
		return next();
	}
	res.redirect('/');
}

router.get('/', function(req, res) {
	res.render('login');
});

router.post('/login', passport.authenticate('login', {
	successRedirect: '/rides',
	failureRedirect: '/',
	failureFlash : true
}));

router.get('/signup', function(req, res){
	res.render('register');
});

router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/rides',
	failureRedirect: '/signup',
	failureFlash : true
}));

router.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/');
});


//USER ROUTES
router.route('/users')
  .get(function (req, res) {
    models.Users.forge()
    .fetch({ withRelated: ['rides', 'requests'] })
    .then(function (users) {
      res.json({ error: false, data: users.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .post(function (req, res) {
    models.User.forge({
      username: req.body.username,
      email: req.body.email
    })
    .save()
    .then(function (user) {
      res.json({ error: false, data: { id: user.get('id') } });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/users/:id')
  .get(function (req, res) {
    models.User.forge({ id: req.params.id })
    .fetch({ withRelated: ['rides', 'requests'] })
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


//RIDE ROUTES
router.route('/rides')
  .get(function (req, res) {
    models.Rides.forge()
    .fetch({ withRelated: ['requests', 'user'] })
    .then(function (rides) {
      res.render('rides', { data: rides.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .post(function (req, res) {
    models.Ride.forge({
      destination: req.body.destination,
      spacesAvailable: req.body.spacesAvailable,
      user_id: req.body.user_id
    })
    .save()
    .then(function (ride) {
      res.json({ error: false, data: ride.toJSON() });
      rideEmitter.newRide(ride.toJSON());
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route("/rides/events")
  .get(function(req, res) {
    var sse = startSse(res);
    rideEmitter.on("newRide", sendRide);
    rideEmitter.on("updateRide", updateRide);
    rideEmitter.on("deleteRide", deleteRide);

    req.once("end", function() {
      rideEmitter.removeListener("newRide", sendRide);
      rideEmitter.removeListener("updateRide", updateRide);
      rideEmitter.removeListener("deleteRide", deleteRide);
    });

    function sendRide(ride) {
      sse("newRide", ride);
    }

    function updateRide(ride) {
      sse("updateRide", ride);
    }

    function deleteRide(id) {
      var ride = {
        id: id
      };
      sse("deleteRide", ride);
    }
  });

router.route('/rides/:id')
  .get(function (req, res) {
    models.Ride.forge({ id: req.params.id })
    .fetch({ withRelated: ['requests', 'user'] })
    .then(function (ride) {
      if(!ride) {
        res.status(404).json({ error: true, data: {} });
      }
      else {
        res.json({ error: false, data: ride.toJSON() });
      }
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .put(function (req, res) {
    models.Ride.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (ride) {
      ride.save({
        spacesAvailable: req.body.spacesAvailable
      })
      .then(function (savedRide) {
        res.json({ error: false, data: savedRide.toJSON() });
        rideEmitter.updateRide(savedRide.toJSON());
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .delete(function (req, res) {
    models.Ride.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (ride) {
      ride.destroy()
      .then(function () {
        rideEmitter.deleteRide(req.params.id);
        res.json({ error: true, data: { message: 'Ride successfully deleted' } });
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });


//REQUEST ROUTES
router.route('/rides/:id/requests')
  .get(function (req, res) {
    models.Ride.forge({ id: req.params.id })
    .fetch({ withRelated: ['requests', 'user'] })
    .then(function (ride) {
      var requests = ride.related('requests');
      res.json({ error: false, data: requests.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/requests')
  .post(function (req, res) {
    models.Request.forge({
      user_id: req.body.user_id,
      ride_id: req.body.ride_id,
      created_at: new Date()
    })
    .save()
    .then(function (request) {
      res.json({ error: false, data: request.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/requests/:id')
  .put(function (req, res) {
    models.Request.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (req) {
      req.save({
        accepted: req.body.accepted,
        updated_at: new Date()
      })
      .then(function () {
        res.json({ error: false, data: { message: 'Request details updated' } });
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })

function startSse(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  return function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

//===============PORT=================

var port = process.env.PORT || 5000;
server.listen(port);
console.log("listening on " + port + "!");
