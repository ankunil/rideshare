var request = require('superagent');

exports.createRide = function(ride, callback){
  request.post('/rides')
  .send(ride)
  .end(callback(ride));
};

exports.getRides = function(callback){
  request.get('/rides')
  .end(function(err, res){
    callback(res.body.data);
  });
};

exports.deleteRide = function(id, callback){
  request.del('/rides/'+id)
  .end(function(err, res){
    callback(id);
  });
}
