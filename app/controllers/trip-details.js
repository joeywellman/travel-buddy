'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, $controller, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap, UserFactory) {

  const tripLocations = [];
  let userPlaces = null;
  $scope.tripLoading = true;
  
  
  // FAVORITING AND UNFAVORITING //
  
  // if this is the current user's trip, edit button appears
    const checkUser = uid => {
      if($scope.trip.uid === uid){
        $scope.trip.myTrip = true;
      }
    };
  
    // checks if this trip is in the user's favorite trips
    const checkFavorite = uid => {
      TripFactory.getMyFavorites(uid)
      .then(favoriteObj => {
        for (let fave in favoriteObj){
          if (favoriteObj[fave].id == $routeParams.tripId){
            $scope.trip.favorite = true;
            $scope.trip.faveId = favoriteObj[fave].id;
          }
        }
      });
    };

  // assembles favorite object and posts to firebase
  const postFavorite = tripId => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj)
      .then(data => {
        checkFavorite(firebase.auth().currentUser.uid);
      });
  };

  // checks whether a user is logged in and then calls postFavorite function
  $scope.addFavorite = tripId => {
    if (firebase.auth().currentUser !== null) {
      postFavorite(tripId);
    } else {
      UserFactory.login()
        .then(() => {
          postFavorite(tripId);
        });
    }
  };
  
  // delete from favorites
  $scope.deleteFavorite = faveId => {
    TripFactory.deleteFave(faveId)
      .then(data => {
        $scope.trip.favorite = false;
      });
  };

  // LOADING TRIP DETAILS //

// helper function to construct lat long object for map center
  const setMapCenter = placeDetails => {
    let firstLat = placeDetails[0].geometry.location.lat;
    let firstLong = placeDetails[0].geometry.location.lng;
    $scope.mapCenter = `${firstLat}, ${firstLong}`;
  };

  // adds creator's descriptions to trip locations
  const addDescriptions = googlePlaces => {
    let placesWithDescriptions = googlePlaces.map((place, index) => {
      place.description = userPlaces[index].description;
      return place;
    });
    return placesWithDescriptions;
  };
  
  // gets trip info from firebase
  TripFactory.getTripDetails($routeParams.tripId)
  .then((tripDetails => {
    $scope.trip = tripDetails;
    $scope.trip.id = $routeParams.tripId;
    if (firebase.auth().currentUser !== null) {
      let uid = firebase.auth().currentUser.uid;
      checkFavorite(uid); // if a user has favorited this trip, the star fills in
      checkUser(uid); // if the user created this trip, they'll see an edit button
    }
    return TripFactory.getFirebasePlaces(tripDetails.locations); // get firebase places
  }))
  .then(fbPlaceData => { // gets place details from firebase
    userPlaces = TripFactory.formatPlaceIds(fbPlaceData);
    return GMapsFactory.getGooglePlaces(userPlaces); // get google palce details
  })
  .then(placeDetails => { // gets place details from google places
    let tripLocations = GMapsFactory.formatPlaces(placeDetails);
    tripLocations = addDescriptions(tripLocations);
    $scope.tripLocations = tripLocations;
    $scope.tripLoaded = true;
    setMapCenter(tripLocations);
  });

  // MAP // 

  // center the map when, called when a user mouses over a place card
  $scope.setMapCenter = location => {
    $scope.mapCenter = location.formatted_address;
  };

  // show the infowindow
  $scope.showDetails = function (event, location) {
    $scope.selectedLocation= location;
    $scope.map.showInfoWindow("details", location.id);
  };

  // hide the infowindow
  $scope.hideDetail = () => {
    $scope.map.hideInfoWindow("details");
  };

  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      checkFavorite(user.uid);
      checkUser(user.uid);
    }
  });

 
});