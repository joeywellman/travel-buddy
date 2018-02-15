'use strict';

angular.module("TravelBuddy").controller("EditInitCtrl", function ($scope, $routeParams, TripBuilderFactory, TripFactory) {
  $scope.title = "Let's make some changes.";
  TripFactory.getTripDetails($routeParams.tripId)
    .then(tripDetails => {
      tripDetails.tags = tripDetails.tags.join(', ');
      TripBuilderFactory.trip = tripDetails;
      $scope.trip = TripBuilderFactory;
      console.log("trip builder factory", TripBuilderFactory);
    });
  });