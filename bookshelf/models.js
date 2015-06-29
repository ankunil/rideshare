var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'ks',
    database : 'ridetest2'
  }
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
  tableName: 'users',
  rides: function(){
    return this.hasMany(Ride, 'userId');
  },
  requests: function(){
    return this.hasMany(Request, 'userId');
  },
  notifications: function(){
    return this.hasMany(Notification, 'userId');
  }
});
var Ride = Bookshelf.Model.extend({
  tableName: 'rides',
  user: function() {
    return this.belongsTo(User, 'userId');
  },
  requests: function(){
    return this.hasMany(Request, 'rideId');
  },
  notifications: function(){
    return this.hasMany(Notification, 'rideId');
  }
});
var Request = Bookshelf.Model.extend({
  tableName: 'requests',
  user: function() {
    return this.belongsTo(User, 'userId');
  },
  ride: function(){
    return this.belongsTo(Ride, 'rideId');
  }
});
var Notification = Bookshelf.Model.extend({
  tableName: 'notifications',
  user: function() {
    return this.belongsTo(User, 'userId');
  },
  ride: function(){
    return this.belongsTo(Ride, 'rideId');
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
var Notifications = Bookshelf.Collection.extend({
  model: Notification
});

module.exports = {
  User: User,
  Ride: Ride,
  Request: Request,
  Notification: Notification,
  Users: Users,
  Rides: Rides,
  Requests: Requests,
  Notifications: Notifications
}
