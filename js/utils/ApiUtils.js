var ServerActions = require('../actions/ServerActions');
var Utils = require('../../functions');

var ApiUtils = {
  loadRides: function(){
    Utils.getRides()
    .then(function(response){
      ServerActions.loadedRides(response.rides)
    })
    .fail(function(){
      console.log("error getting rides");
    });
  }
}
