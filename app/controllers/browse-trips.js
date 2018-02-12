'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, NgMap, GMapsCreds) {
  $scope.title = "Browse Trips";

  // posts a trip to the user's favorites
  $scope.addFavorite = (tripId) => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj);
  };

  // this should filter out the user's trips? or mark it if it's one of the user's trips
  TripFactory.getAllPublicTrips()
  .then (trips => {
    $scope.trips = trips;
  }); 
});