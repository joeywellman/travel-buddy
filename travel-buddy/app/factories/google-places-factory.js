'use strict';

angular.module("TravelBuddy").factory("GMapsFactory", (GMapsCreds, $http, $q) => {
  
  const addImageKey = (placeObject) => {
    if (placeObject.hasOwnProperty('photos') && placeObject.photos.length > 0) {
      let imageKey = placeObject.photos[0].photo_reference;
      placeObject.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
    }
  };

  const placesSearch = (searchString) => {
    return $q((resolve, reject) => {
      $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/textsearch/json?query=${searchString}&key=${GMapsCreds.apiKey}`)
        .then((places) => {
          resolve(places.data.results);
        });
    });
  };

  // passes array of place ids into google places details request
  const getGooglePlaces = (placeData) => {
    const promises = [];
    placeData.forEach(place => {
      let promise = $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${place.place_id}&key=${GMapsCreds.apiKey}`);
      promises.push(promise);
    });
    return $q.all(promises);
  };

  // destructures data and adds image key to places 
  const formatPlaces = (placeData) => {
    const formattedPlaces = placeData.map(place => {
      addImageKey(place.data.result);
      return place.data.result;
    });
    return formattedPlaces;
  };



  return {placesSearch, getGooglePlaces, formatPlaces};

});