var express = require('express'),
    exphbs  = require('express3-handlebars');
var funct = require('./functions.js'),
    fs = require('fs'),
    bodyParser = require('body-parser');

var RideModel = require('./ride-model');
var app = express();


//===============EXPRESS=================


// Configure Express
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'supernova' }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static(__dirname + "/public/"));

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

var hbs = exphbs.create({
    defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//===============ROUTES=================


app.get('/',  function(req, res){
  res.render('rides');
});

app.get('/rides', function(req, res){
  RideModel.find(function (err, doc) {
    res.send(doc);
  });
});


//===============PORT=================


var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");
