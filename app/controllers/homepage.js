'use strict';
angular.module("TravelBuddy").controller("HomepageCtrl", function ($scope, GMapsFactory, TripFactory, NgMap, GMapsCreds) {

  $scope.mapCenter = "35, 82";


  // don't let user's favorite their own trips
 $scope.checkUser = (uid) => {
   let allTrips = $scope.trips;
    allTrips.forEach(trip => {
       if (trip.uid === uid) {
         trip.myTrip = true;
       }
     });
  };


  // loops through $scope.trips and checks if each trip is in the current user's favorites
  // if the user has favorited a given trip, give that trip a property of 'favorite' with a value of 'true'
  $scope.markAsFaves = (favoriteTrips) => {
    let faves = [];
    let allTrips = $scope.trips;
    allTrips.forEach(trip => {
      favoriteTrips.forEach(fave => {
        if (trip.id === fave.id) {
          trip.favorite = true;
          trip.faveId = fave.fbId;
          faves.push(trip);
        }
      });
      return trip;
    });
    $scope.faves = faves;
  };

  // gets current user's favorite trips from Firebase
  $scope.getFavorites = (uid) => {
    TripFactory.getMyFavorites(uid)
      .then(faves => {
        $scope.markAsFaves(faves);
      });
  };


  // converts tags from array to strings, accounts for ng-tag-input (array of objects) and array of strings (from before I implemented ng-tags-input)
  const sliceTags = (trips) => {
    let tripsWithTags = trips.map(trip => {
      if (trip.tags[0] !== null && typeof trip.tags[0] === 'object'){ // if tags were created with ng-tag
        trip.tags = trip.tags.map(tag => {
          tag = tag.text;
          return tag;
        });
        trip.tags = trip.tags.join(', ');
        return trip;
      } else{
        trip.tags = trip.tags.join(', ');
        return trip;
      }
    });
    return tripsWithTags;
  };


    // defines a function that gets all public trips
  $scope.getTrips = () => {
    TripFactory.getAllTrips()
      .then(trips => {
        $scope.trips = sliceTags(trips);
        $scope.dataLoaded = true;
        if (firebase.auth().currentUser !== null) {
          let uid = firebase.auth().currentUser.uid;
          $scope.getFavorites(uid);
          $scope.checkUser(uid);
        }
      });
  };

  // show infowindow, fired on marker click
  $scope.showDetails = function (event, trip) {
    $scope.selectedTrip = trip;
    $scope.map.showInfoWindow("details", trip.startingPoint);
  };

  // hide infowindow
  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("details");
  };

  
  $scope.getTrips();


});