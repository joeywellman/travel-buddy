'use strict';
angular.module("TravelBuddy").controller("InitTripCtrl", function ($scope, TripBuilderFactory) {
  $scope.title = "Let's get started";
  $scope.trip = TripBuilderFactory;
});