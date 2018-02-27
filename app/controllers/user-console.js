'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, $controller, TripFactory, GMapsFactory, GMapsCreds) {
  const favoriteTrips = [];

  // inherits delete favorite function from browse trips controller
  $controller("BrowseTripsCtrl", { $scope: $scope });

  // defined in homepage controller (grandparent)
  // inherited from browse trips controller (parent)
  // fetches all trips- template controls what the user sees
  $scope.getTrips();

  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if (user && $scope.trips !== null) {
      $scope.getFavorites(user.uid);
      $scope.checkUser(user.uid);
    } else {
      $scope.getTrips();
    }
  });

  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(data => {
      $scope.getTrips();
    });
  };

});