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
        for (let favorite in favoriteData){
          TripFactory.getTripDetails(favoriteData[favorite].id)
          .then ((tripDetails) => {
            favoriteTrips.push(tripDetails);
          });
        }
        $scope.faves = favoriteTrips;
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
  // need to figure out a way to do this without deleting the trip
  $scope.deleteFave = (trip) => {
    console.log("You deleted this fave", trip);
  //   TripFactory.deleteFave(tripId)
  //   .then(() => {
  //     TripFactory.getMyFavorites(firebase.auth().currentUser.uid)
  //     .then((faves) => {
  //       $scope.faves = faves;
  //     });
  //   });
  };

});