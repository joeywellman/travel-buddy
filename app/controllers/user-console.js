'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {
  const favoriteTrips = [];

  // converts firebase data to array and adds firebase key 
  function convertToArray(dataObject) {
    let keys = Object.keys(dataObject);
    let dataArray = keys.map(key => {
      dataObject[key].fbId = key;
      return dataObject[key];
    });
    return dataArray;
  } 

        

  const getFavorites = (user) => {
    TripFactory.getMyFavorites(user.uid)
    .then(favorites => {
      favorites = convertToArray(favorites);
      return TripFactory.getFavoriteDetails(favorites);
    })
    .then(faveDetails => {
      faveDetails = faveDetails.map(fave => {
        fave = fave.data;
        return fave;
      });
      $scope.faves = faveDetails;
    });
  };


  // fetches trips and favorites when user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(user.uid)
      .then(trips => {
        $scope.trips = trips;
        getFavorites(user);
      });
    } else {
      $scope.errorMessage = "Please log in to see your trips!";
    }
  });

  // delete trip and then re-fetch trips
  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(() => {
      TripFactory.getMyTrips(firebase.auth().currentUser.uid)
      .then(trips => {
        $scope.trips = trips;
      });
    });
  };

  // delete fave and then re-fetch faves
  $scope.deleteFave = (fave) => {
    TripFactory.deleteFave(fave.fbId)
    .then(() => {
      getFavorites(firebase.auth().currentUser);
    });
  };

});