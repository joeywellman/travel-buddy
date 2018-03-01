'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, $controller, TripFactory, GMapsFactory, GMapsCreds, UserFactory) {
  const favoriteTrips = [];
  const currentUser = firebase.auth().currentUser;
  $scope.errorMessage = "Please log in to see information about your trips!"

  // inherits from Browse Trips Controller (direct parent) and Homepage Controller (grandparent)
  $controller("BrowseTripsCtrl", { $scope: $scope });

  // these functions are defined in homepage controller (grandparent)
  // inherited from browse trips controller (parent)
  // fetches all trips, gets user favorites, and checks if the current user created each trip
  const loadPage = (user) => {
    $scope.getTrips();
    $scope.getFavorites(user.uid);
    $scope.checkUser(user.uid);
  };


  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.user = true;
      loadPage(user);
    } else {
      $scope.user = false;
    }
  });



  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(data => {
      $scope.getTrips();
    });
  };

});