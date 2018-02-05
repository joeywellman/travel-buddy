'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams) {
  $scope.title = "This is the trip details controller";

  // TripFactory.getTripDetails($routeParams.tripId)
  // should get back one trip object
  // set to scope

  //loop through place array, pass each place into TripFactory.getPlaceDetails
  // pass gmaps id to map

  // on click --> add to Faves(uid, tripId)

  // if this is the current user's trip, edit button appears

  

});