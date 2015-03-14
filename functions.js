var Q = require('q');
var request = require('superagent');

// function getRide (key) {
// };

exports.getRides = function(){
  request.get('/rides')
  .end(function(err, res){
    return res
  });
};
