'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory) {
  $scope.title = "This is the user console view!";

  //TripFactory.getMyTrips(uid)
  // set to scope

  // TripFactory.getMyFavorites(uid)
  // set to scope

  // click on one of your trips --> route to edit trip view

  // click on star --> delete from favorites
});