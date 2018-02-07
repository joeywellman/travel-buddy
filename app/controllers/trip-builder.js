'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "This is the Build Trip View!";

  GMapsFactory.placesSearch("churches in Romania")
  .then((places) => {
    console.log("this is the places from the controller", places);
    console.log($scope.searchString);
    $scope.places = places;
    let imageKey = places[0].photos[0].photo_reference;
    $scope.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
  });
  

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