'use strict';
angular.module("TravelBuddy").controller("HomepageCtrl", function ($scope, GMapsFactory, TripFactory, NgMap, GMapsCreds) {

  $scope.mapCenter = "35, 82";

    // defines a function that gets all public trips and formats them with starting points and cover photos
  $scope.getTrips = () => {
    TripFactory.getAllPublicTrips()
      .then(trips => {
        $scope.dataLoaded = true;
        $scope.trips = trips;
      });
  };

  // show infowindow, fired on marker click
  $scope.showDetails = function (event, trip) {
    $scope.selectedTrip = trip;
    $scope.map.showInfoWindow("details", trip.startingPoint.place_id);
  };

  // hide infowindow
  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("details");
  };

  
  $scope.getTrips();


});