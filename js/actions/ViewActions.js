var ApiUtils = require('../utils/ApiUtils');

var RideActions = {
  loadRides: function(){
    ApiUtils.loadRides();
  }

};

module.exports = RideActions;
