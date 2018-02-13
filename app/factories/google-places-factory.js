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
  
  // THE ISSUE IS PLACE.ID VS. PLACE.PLACE_ID
  function getGooglePlaces(placeData){
    const promises = [];
    placeData.forEach(place => {
      let promise = $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${place.id}&key=${GMapsCreds.apiKey}`);
      promises.push(promise);
    });
    return $q.all(promises);
  }

  // destructures data and adds image key to places 
  function formatPlaces(placeData) {
    const formattedPlaces = placeData.map(place => {
      addImageKey(place.data.result);
      return place.data.result;
    });
    return formattedPlaces;
  }

  function addImageKey(placeObject) {
    if (placeObject.photos[0].photo_reference !== null) {
      let imageKey = placeObject.photos[0].photo_reference;
      placeObject.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
    }
  }


  


  return {placesSearch, getPlaceInfo, getGooglePlaces, formatPlaces};

});