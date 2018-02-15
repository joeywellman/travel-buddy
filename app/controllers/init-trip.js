'use strict';
angular.module("TravelBuddy").controller("InitTripCtrl", function ($scope, TripBuilderFactory) {
  $scope.trip = TripBuilderFactory;
});