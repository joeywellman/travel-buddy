'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory) {
  $scope.title = "This is the Browse All Trips View!";

  // TripFactory.getAllTrips
  // set to scope

  // grab first place in each trip's array
  // pass in each place id into TripFactory.getPlaceDetails
  // pass gmaps id into map
});