var ServerActions = require('../actions/ServerActions');
var request = require('superagent');

var ApiUtils = {
  checkForSession: function(){
    request.get('/isloggedin')
    .end(function(err, res){
      if(res.body){
        console.log('found user:', res.body.data);
        ServerActions.signedInUser(res.body.data);
        ServerActions.loadedNotifications(res.body.data.notifications);
      }
    });
  },

  registerUser: function(user){
    request.post('/signup')
    .type('form')
    .send(user)
    .end(function(err, res){
      if (res.error === false) {
        console.log('registered user:', res.body.data);
        ServerActions.registeredUser(res.body.data);
      }
      ServerActions.registerFlash(res);
    });
  },

  signInUser: function(user){
    request.post('/login')
    .type('form')
    .send(user)
    .end(function(err, res){
      if (res.error === false && !err) {
        console.log('signed in user:', res.body)
        ServerActions.signedInUser(res.body.data);
        ServerActions.loadedNotifications(res.body.data.notifications);
      }
      ServerActions.signInFlash(res);
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
      if(res.error === false){
        console.log('posted ride:', res.body);
        ServerActions.createdRide(res.body.data);
      }
      ServerActions.createRideFlash(res);
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

  loadRequests: function(){
    request.get('/requests')
    .end(function(err, res){
      console.log('loaded requests:', res);
      ServerActions.loadedRequests(res.body.data);
    });
  },

  createRequest: function(rideReq){
    request.post('/requests')
    .send(rideReq)
    .end(function(err, res){
      console.log('posted request:', res.body);
      ServerActions.createdRequest(res.body.data);
    });
  },

  updateRequest: function(rideReq){
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
      console.log('deleted request:', res.body.data.id);
      ServerActions.deletedRequest(res.body.data);
    });
  },

  createNtf: function(notification){
    request.post('/notifications')
    .send(notification)
    .end(function(err, res){
      console.log('posted notification:', res.body);
      ServerActions.createdNotification(res.body.data);
    });
  },

  loadNtfs: function(id){
    request.get(`users/${id}/notifications`)
    .end(function(err, res){
      console.log('loaded notifications:', res);
      ServerActions.loadedNotifications(res.body.data);
    });
  },

  updateNtfs: function(userId){
    request.put(`users/${userId}/notifications`)
    .end(function(err, res){
      console.log('updated notifications:', res);
      ServerActions.loadedNotifications(res.body.data);
    });
  },

  deleteNtf: function(id){
    request.del('/notifications/'+id)
    .end(function(err, res){
      console.log('deleted notification:', res.body);
      ServerActions.deletedNotification(id);
    });
  },
};

module.exports = ApiUtils;
