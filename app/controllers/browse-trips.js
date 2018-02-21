'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, GMapsFactory, NgMap, GMapsCreds, UserFactory) {
  
  // assembles favorite object and posts to firebase
  const postFavorite = (tripId) => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj);
  };

  // checks whether a user is logged in and then calls postFavorite function
  $scope.addFavorite = (tripId) => {
    if (firebase.auth().currentUser !== null){
      postFavorite(tripId);
    } else {
      UserFactory.login()
      .then(()=> {
        postFavorite(tripId);
      });
    }
  };

  // gets all public trips from firebase and sets to scp
  TripFactory.getAllPublicTrips()
    .then(trips => {
      $scope.trips = trips;
    });
  
  
});