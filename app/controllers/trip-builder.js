'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, TripFactory) {
  $scope.title = "This is the Build Trip View!";

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