'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory) {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(firebase.auth().currentUser.uid)
      .then((trips) => {
        $scope.trips = trips;
      });
    }
  });
  

  // TripFactory.getMyFavorites(uid)
  // set to scope

  // click on one of your trips --> route to edit trip view

  // click on star --> delete from favorites
});