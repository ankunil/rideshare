var ServerActions = require('../actions/ServerActions');
var request = require('superagent');

var ApiUtils = {
  registerUser: function(user){
    console.log(user);
    request.post('/signup')
    .type('form')
    .send(user)
    .end(function(err, res){
      console.log('registered user:', res.body);
      ServerActions.registeredUser(res.body.data);
    });
  },

  signInUser: function(user){
    request.post('/login')
    .type('form')
    .send(user)
    .end(function(err, res){
      console.log('signed in user:', res.body);
      ServerActions.signedInUser(res.body.data);
    });
  },

  loadRides: function(){
    request.get('/rides')
    .end(function(err, res){
      console.log('loaded rides:', res);
      ServerActions.loadedRides(res.body.data);
    });
  },

  createRide: function(ride){
    request.post('/rides')
    .send(ride)
    .end(function(err, res){
      console.log('posted ride:', res.body);
      ServerActions.createdRide(res.body.data);
    });
  },

  updateRide: function(ride){
    request.put('/rides/'+ride.id)
    .send(ride)
    .end(function(err, res){
      console.log('updated ride:', res.body);
      ServerActions.updatedRide(res.body.data);
    });
  },

  deleteRide: function(id){
    request.del('/rides/'+id)
    .end(function(err, res){
      console.log('deleted ride:', res.body);
      ServerActions.deletedRide(id);
    });
  },

  createRequest: function(request){
    request.post('/requests')
    .send(rideReq)
    .end(function(err, res){
      console.log('posted request:', res.body);
      ServerActions.createdRequest(res.body.data);
    });
  },

  updateRequest: function(request){
    request.put('/requests/'+rideReq.id)
    .send(rideReq)
    .end(function(err, res){
      console.log('updated request:', res.body);
      ServerActions.updatedRequest(res.body.data);
    });
  },

  deleteRequest: function(id){
    request.del('/requests/'+id)
    .end(function(err, res){
      console.log('deleted request:', res.body);
      ServerActions.deletedRequest(id);
    });
  }
};

module.exports = ApiUtils;
