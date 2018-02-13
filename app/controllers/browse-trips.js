'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, GMapsFactory, NgMap, GMapsCreds) {
  $scope.title = "Browse Trips";

  // posts a trip to the user's favorites
  $scope.addFavorite = (tripId) => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj);
  };

  const getStartingPoints = (trips) => {
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  const getAddresses = (googlePlaces) => {
    let addresses = googlePlaces.map(place => {
      console.log("place in get addresses loop", place.data.result);
      let address = place.data.result.formatted_address;
      return address;
    });
    return addresses;
  };

  const formatPlaceData = (fbPlaceData) => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  // this should filter out the user's trips? or mark it if it's one of the user's trips
  TripFactory.getAllPublicTrips()
  .then (trips => {
    let startingPoints = getStartingPoints(trips);
    console.log("this should be each trip's starting point");
    TripFactory.getFirebasePlaces(startingPoints)
    .then(fbPlaces => {
      let userPlaces = formatPlaceData(fbPlaces);
      console.log("firebase place details", userPlaces);
      return GMapsFactory.getGooglePlaces(userPlaces);
    })
    .then(googlePlaces => {
      console.log("google places", googlePlaces);
      let markers = getAddresses(googlePlaces);
      $scope.markers = markers;
      console.log($scope.markers);
      $scope.mapCenter = markers[0];
      $scope.trips = trips;
    });
    

  }); 
});