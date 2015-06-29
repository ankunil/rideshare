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
server.use("/", express.static(__dirname));

server.use(expressSession({secret: 'BananaStand'}));
server.use(passport.initialize());
server.use(passport.session());

var flash = require('connect-flash');
server.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

server.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

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
    res.locals.messages = req.flash();
    res.json({ error: false, data: req.user.toJSON() });
  });

router.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/isloggedin', isAuthenticated,
  function(req, res){
		console.log("you are still logged in!", req.session)
		models.User.forge({ id: req.session.passport.user })
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({ error: true, data: {} });
      }
      else {
				delete user.password;
        res.json({ error: false, data: user.toJSON() });
      }
		})
  });

//USER ROUTES
router.route('/users')
  .get(isAuthenticated, function (req, res) {
    models.Users.forge()
    .fetch({ withRelated: ['rides', 'requests'] })
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
      console.log('RIDES HERE:', rides.models);
      res.json({error: false, data: rides.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .post(function (req, res) {
    models.Ride.forge({
      destination: req.body.destination,
      spacesAvailable: req.body.spacesAvailable,
      leavingAt: req.body.leavingAt,
      userId: req.body.userId
    })
    .save()
    .then(function (ride) {
      models.User.forge({ id: req.body.userId })
      .fetch()
      .then(function (user) {
        ride.attributes.user = user;
        res.json({ error: false, data: ride.toJSON() });
        rideEmitter.newRide(ride.toJSON());
      })
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
    .fetch({ require: true, withRelated: ['requests', 'user'] })
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
    .fetch({ withRelated: ['requests'] })
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
      userId: req.body.userId,
      rideId: req.body.rideId,
      createdAt: new Date()
    })
    .save()
    .then(function (request) {
      models.User.forge({
        id: req.body.userId
      })
      .fetch()
      .then(function (user){
        request.attributes.user = user;
        res.json({ error: false, data: request.toJSON() });
      })
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
        updatedAt: new Date()
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
  });

//NOTIFICATION ROUTES
router.route('/users/:id/notifications')
  .get(function (req, res) {
    models.User.forge({ id: req.params.id })
    .fetch({ withRelated: ['notifications'] })
    .then(function (user) {
      var notifications = user.related('notifications');
      res.json({ error: false, data: notifications.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/notifications')
  .post(function (req, res) {
    models.Notification.forge({
      userId: req.body.userId,
      rideId: req.body.rideId,
      message: req.body.message,
      seen: false
    })
    .save()
    .then(function (notification) {
      res.json({ error: false, data: notification.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/notifications/:id')
  .delete(function (req, res) {
    models.Notification.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (notification) {
      notification.destroy()
      .then(function () {
        res.json({ error: true, data: { message: 'Notification successfully deleted' } });
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

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
