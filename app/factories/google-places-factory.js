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
  

    // // should this be moved to factory?
  // $scope.searchPlaces = () => {
  //   GMapsFactory.placesSearch($scope.searchString)
  //     .then((places) => {
  //       places.forEach((place) => {
  //         GMapsFactory.getPlaceInfo(place.place_id)
  //         .then(placeDetails => {
  //           if (placeDetails.data.result.photos[0].photo_reference !== null) {
  //             let imageKey = place.photos[0].photo_reference;
  //             placeDetails.data.result.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
  //           }
  //           searchResults.push(placeDetails.data.result);
  //         });
  //       });
  //       $scope.searchResults = searchResults;
  //     });
  // };
  function getPlaceDetails(placeData){
    const promises = [];
    placeData.forEach(place => {
      let promise = $http.get(`https://travel-buddy-proxy-server.herokuapp.com/api/maps/api/place/details/json?placeid=${place.place_id}&key=${GMapsCreds.apiKey}`);
      promises.push(promise);
    });
    return $q.all(promises);
      // .then(placeDetails =>{
      //   console.log("this is what getPlaceDetails resolves", placeDetails);
      // });
  }

  function addImageProperties(placeDetailsArray){
    // helper function to add image keys?
  }


  


  return {placesSearch, getPlaceInfo, getPlaceDetails};

});