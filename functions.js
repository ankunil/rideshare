var request = require('superagent');

exports.getRides = function(callback){
  request.get('/rides')
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.createRide = function(ride, callback){
  request.post('/rides')
  .send(ride)
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.updateRide = function(ride, callback){
  request.put('/rides/'+ride.id)
  .send(ride)
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.deleteRide = function(id, callback){
  request.del('/rides/'+id)
  .end(function(err, res){
    callback(id);
  });
};

exports.createRequest = function(rideReq, callback){
  request.post('/requests')
  .send(rideReq)
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.updateRequest = function(rideReq, callback){
  request.put('/requests/'+rideReq.id)
  .send(rideReq)
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.deleteRequest = function(id, callback){
  request.del('/requests/'+id)
  .end(function(err, res){
    callback(id);
  });
};
