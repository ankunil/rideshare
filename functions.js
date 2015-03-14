var Q = require('q');
var request = require('superagent');

// function getRide (key) {
// };

exports.getRides = function(callback){
  request.get('/rides')
  .end(function(err, res){
    callback(res.body);
  });
};
