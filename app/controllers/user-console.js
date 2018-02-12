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
        let fbKeys = Object.keys(favoriteData);
        fbKeys.forEach(key => {
          TripFactory.getTripDetails(favoriteData[key].id)
          .then(tripDetails => {
            tripDetails.fbId = key;
            favoriteTrips.push(tripDetails);
          });
        });
        console.log("favorite trips array", favoriteTrips);
        $scope.faves = favoriteTrips;
      });
    }
  });


  const getFavorites = () => {

  };
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
    console.log("You deleted this fave", fave);
    TripFactory.deleteFave(fave.fbId)
    .then(() => {
      TripFactory.getMyFavorites(firebase.auth().currentUser.uid)
      .then((faves) => {
        $scope.faves = faves;
      });
    });
  };

});