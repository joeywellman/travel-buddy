'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory) {

  const favoriteTrips = [];

  // fetches favorites and details for each favorite -> sets them to scope
  const getFavorites = (user) => {
    TripFactory.getMyFavorites(user.uid)
      .then((favoriteData) => {
        let fbKeys = Object.keys(favoriteData);
        fbKeys.forEach(key => {
          TripFactory.getTripDetails(favoriteData[key].id)
            .then(tripDetails => {
              tripDetails.fbId = key;
              favoriteTrips.push(tripDetails);
            });
        });
        $scope.faves = favoriteTrips;
      });
  };

  // fetches trips and favorites when user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(user.uid)
      .then((trips) => {
        $scope.trips = trips;
        getFavorites(user);
      });
    }
  });

  // delete trip and then re-fetch trips
  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(() => {
      TripFactory.getMyTrips(firebase.auth().currentUser.uid)
      .then((trips) => {
        $scope.trips = trips;
      });
    });
  };

  // delete fave and then re-fetch fave
  $scope.deleteFave = (fave) => {
    TripFactory.deleteFave(fave.fbId)
    .then(() => {
      TripFactory.getMyFavorites(firebase.auth().currentUser.uid)
      .then((faves) => {
        $scope.faves = faves;
      });
    });
  };

});