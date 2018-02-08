'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, NgMap, GMapsCreds) {
  $scope.title = "Browse Trips";


  TripFactory.getAllPublicTrips()
  .then (trips => {
    $scope.trips = trips;
  });
 


  // grab first place in each trip's array
  // pass in each place id into TripFactory.getPlaceDetails
  // pass gmaps id into map

 
});