'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";

  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
    .then((places) => {
      places.map((place) => {
        let imageKey = place.photos[0].photo_reference; 
        place.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
      });
      console.log("this should have an image key attached", places)
      $scope.places = places;
    });
  };
  

  //empty trip object on scope bound to input
  // name
  // description
  // location
  // tags
  // place array
  // uid

  // empty place object on scope
  // gmaps id
  // description

  // on click --> tripFactory.addTrip
    // save button: trip.public = false
    // publish button = trip.public = true
  // add PLACE OBJECT for every object in the trip's place array every time you post a trip
});