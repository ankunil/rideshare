var ServerActions = require('../actions/ServerActions');
var Utils = require('../../functions');

var ApiUtils = {
  loadRides: function(){
    debugger;
    Utils.getRides(function(rides){
      ServerActions.loadedRides(rides)
    });
  }
};

module.exports = ApiUtils;
