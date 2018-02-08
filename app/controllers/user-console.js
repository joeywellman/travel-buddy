'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory) {

  const favoriteTrips = [];

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(user.uid)
      .then((trips) => {
        $scope.trips = trips;
        return TripFactory.getMyFavorites(user.uid);
      })
      .then((favoriteData) => {
        console.log("this is the user's favorites", favoriteData);
        for (let favorite in favoriteData){
          console.log("this should be each individual trip id", favoriteData[favorite]); // this is a string
          TripFactory.getTripDetails(favoriteData[favorite].id)
          .then ((tripDetails) => {
            favoriteTrips.push(tripDetails);
          });
        }
        $scope.faves = favoriteTrips;
        console.log("this is the faves array", $scope.faves);
      });
    }
  });

  // delete trip and then re-fetch trips
  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(() => {
      TripFactory.getMyTrips(firebase.auth().getCurrentUser.uid)
      .then((trips) => {
        $scope.trips = trips;
      });
    });
  };

  // delete fave and then re-fetch fave
  $scope.deleteFave = (tripId) => {
    TripFactory.deleteFave(tripId)
    .then(() => {
      TripFactory.getMyFavorites(firebase.auth().getCurrentUser.uid)
      .then((faves) => {
        $scope.faves = faves;
      });
    });
  };

});