'use strict';

angular.module("TravelBuddy").factory("GMapsFactory", (GMapsCreds, $http, $q) => {

  function placesSearch(searchString) {
    return $q((resolve, reject) => {
      $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/textsearch/json?query=${searchString}&key=${GMapsCreds.apiKey}`)
        .then((places) => {
          resolve(places.data.results);
        });
    });
  }

  function getPlaceDetails(placeId) {
    return $q((resolve, reject) => {
      $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${placeId}&key=${GMapsCreds.apiKey}`)
        .then((placeDetails) => {
          console.log("this is the whole return fro the place  details call", placeDetails);
          resolve(placeDetails);
        });
    });
  }


  


  return {placesSearch, getPlaceDetails};

});