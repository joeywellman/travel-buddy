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

  function getPlaceInfo(placeId) {
    return $q((resolve, reject) => {
      $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${placeId}&key=${GMapsCreds.apiKey}`)
        .then((placeDetails) => {
          resolve(placeDetails);
        });
    });
  }
  
  function getPlaceDetails(placeData){
    const promises = [];
    placeData.forEach(place => {
      let promise = $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${place.place_id}&key=${GMapsCreds.apiKey}`);
      promises.push(promise);
    });
    return $q.all(promises);
  }


  


  return {placesSearch, getPlaceInfo, getPlaceDetails};

});