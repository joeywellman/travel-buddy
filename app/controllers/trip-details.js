'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, NgMap) {
  $scope.title = "This is the trip details controller";

  $scope.center = "41,-87";
  $scope.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${GMapsCreds.apiKey}`;
  NgMap.getMap().then(function (map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });


  // TripFactory.getTripDetails($routeParams.tripId)
  // should get back one trip object
  // set to scope

  //loop through place array, pass each place into TripFactory.getPlaceDetails
  // pass gmaps id to map

  // on click --> add to Faves(uid, tripId)

  // if this is the current user's trip, edit button appears

  

});