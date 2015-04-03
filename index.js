var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'ks',
    database : 'rstest'
  }
});

var Bookshelf = require('bookshelf')(knex);
var User = Bookshelf.Model.extend({
  tableName: 'users',
  rides: function(){
    return this.hasMany(Ride, 'user_id');
  }
});
var Ride = Bookshelf.Model.extend({
  tableName: 'rides',
  user: function() {
    return this.belongsTo(User, 'user_id');
  },
  requests: function(){
    return this.hasMany(Request, 'ride_id');
  }
});
var Request = Bookshelf.Model.extend({
  tableName: 'requests',
  user: function() {
    return this.belongsTo(User);
  },
  ride: function(){
    return this.belongsTo(Ride);
  }
});
var Users = Bookshelf.Collection.extend({
  model: User
});
var Rides = Bookshelf.Collection.extend({
  model: Ride
});
var Requests = Bookshelf.Collection.extend({
  model: Request
});

//==============SSE SETUP================

function RideEmitter() {
  this.basket = [];//does not matter
}
require("util").inherits(RideEmitter, require("events").EventEmitter);

RideEmitter.prototype.ride = function(ride) {
  this.emit("ride", ride);
};

var rideEmitter = new RideEmitter();

//=======================================


var express = require('express'),
    exphbs  = require('express3-handlebars');
var funct = require('./functions.js'),
    fs = require('fs'),
    bodyParser = require('body-parser');

var server = express();
var router = express.Router();


//===============EXPRESS=================

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use("/", express.static(__dirname + "/public/"));

server.use(router);

var hbs = exphbs.create({
    defaultLayout: 'main',
});
server.engine('handlebars', hbs.engine);
server.set('view engine', 'handlebars');


//===============ROUTES=================


server.get('/',  function(req, res){
  res.render('rides');
});


//USER ROUTES
router.route('/users')
  .get(function (req, res) {
    Users.forge()
    .fetch({ withRelated: ['rides', 'requests'] })
    .then(function (users) {
      res.json({ error: false, data: users.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .post(function (req, res) {
    User.forge({
      name: req.body.name,
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
    User.forge({ id: req.params.id })
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
    User.forge({ id: req.params.id })
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
    Rides.forge()
    .fetch({ withRelated: ['requests', 'user'] })
    .then(function (rides) {
      res.json({ error: false, data: rides.toJSON() });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  })
  .post(function (req, res) {
    Ride.forge({
      destination: req.body.destination,
      spacesAvailable: req.body.spacesAvailable,
      user_id: req.body.user_id
    })
    .save()
    .then(function (ride) {
      res.json({ error: false, data: ride.toJSON() });
      rideEmitter.ride(ride.toJSON());
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route("/rides/events")
  .get(function(req, res) {
    console.log("somethings happening");
    var sse = startSse(res);
    rideEmitter.on("ride", sendRide);

    req.once("end", function() {
      rideEmitter.removeListener("ride", sendRide);
    });

    function sendRide(ride) {
      sse("ride", ride);
    }
  });

router.route('/rides/:id')
  .get(function (req, res) {
    Ride.forge({ id: req.params.id })
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
    Ride.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (req) {
      req.save({
        spacesAvailable: req.body.spacesAvailable || req.get('spacesAvailable')
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
  .delete(function (req, res) {
    Ride.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (ride) {
      ride.destroy()
      .then(function () {
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
    Ride.forge({ id: req.params.id })
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
    Request.forge({
      user_id: req.body.user_id,
      ride_id: req.body.ride_id,
      created_at: new Date()
    })
    .save()
    .then(function (request) {
      res.json({ error: false, data: { id: request.get('id') } });
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  });

router.route('/requests/:id')
  .put(function (req, res) {
    Request.forge({ id: req.params.id })
    .fetch({ require: true })
    .then(function (req) {
      req.save({
        accepted: req.body.accepted || req.get('accepted'),
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
