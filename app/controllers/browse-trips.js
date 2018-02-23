'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, $controller, TripFactory, GMapsFactory, NgMap, GMapsCreds, UserFactory) {
  
  // inherits functions to get starting points and photos for trips
  $controller("HomepageCtrl", { $scope: $scope });

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

  // defined in homepage.js, gets all public trips and formats with starting points and cover photos
  $scope.getTrips();
 
});