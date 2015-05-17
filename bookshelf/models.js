var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'ks',
    database : 'newtest'
  }
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
  tableName: 'users',
  rides: function(){
    return this.hasMany(Ride, 'user_id');
  }
});

var Users = Bookshelf.Collection.extend({
  model: User
});

module.exports = {
  User: User,
  Users: Users
};
