'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, $controller, TripFactory, UserFactory) {
  
  // inherits functions to get starting points and photos for trips
  $controller("HomepageCtrl", { $scope: $scope });

  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if(user && $scope.trips !== null){
      $scope.getFavorites(user.uid);
      $scope.checkUser(user.uid);
    } else {
      $scope.getTrips();
    }
  });


  // assembles favorite object and posts to firebase
  const postFavorite = tripId => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj)
    .then(data => {
      $scope.getFavorites(firebase.auth().currentUser.uid);
    });
  };

  // delete from favorites
 $scope.deleteFavorite = faveId => {
    TripFactory.deleteFave(faveId)
    .then(data => {
      $scope.getTrips();
    });
  };

  // checks whether a user is logged in and then calls postFavorite function
  $scope.addFavorite = tripId => {
    if (firebase.auth().currentUser !== null){
      postFavorite(tripId);
    } else {
      UserFactory.login()
      .then(()=> {
        postFavorite(tripId);
      });
    }
  };

  // defined in homepage.js
  // gets all public trips, checks if they belong to the current user, and check if the current user has favorited them
  $scope.getTrips();


});