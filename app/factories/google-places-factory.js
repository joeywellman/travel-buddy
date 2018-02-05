'use strict';

angular.module("TravelBuddy").factory("GMapsFactory", (GMapsCreds, $http, $q) => {

  function placesSearch() {
    return $q((resolve, reject) => {
      console.log(GMapsCreds.apiKey);
      $http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurante&key=${GMapsCreds.apiKey}`)
        .then(({ data }) => {
          console.log("thisis what you get back in the promise", data);
          resolve(data);
        });
    });
  }


  return {placesSearch};

});