'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, GMapsFactory, NgMap, GMapsCreds) {
  $scope.title = "Browse Trips";
  let publicTrips = null;
  

  // posts a trip to the user's favorites
  $scope.addFavorite = (tripId) => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj);
  };

  // grabs first location from each trip's location array
  const getStartingPoints = (trips) => {
    console.log("data going into get starting points", trips);
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    console.log("data going out of getStartingPoints", startingPoints);
    return startingPoints;
  };

  // adds starting point addresses onto trips
  const addStartingPoints= (googlePlaces) => {
    console.log("data going into add starting points", googlePlaces);
    let tripsWithStartingPoints = publicTrips.map((trip, index) => {
      trip.startingPoint = googlePlaces[index].data.result.formatted_address;
      return trip;
    });
    console.log("data going out of add starting points", tripsWithStartingPoints);
    return tripsWithStartingPoints;
  };

  // this is wonky function that solves a bug with place.id vs place.place_id, need to refactor
  const formatPlaceData = (fbPlaceData) => {
    console.log("data going into format place data", fbPlaceData);
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    console.log("data coming out of format place data", formattedData);
    return formattedData;
  };

  // this should filter out the user's trips? or mark it if it's one of the user's trips
  TripFactory.getAllPublicTrips()
  .then (trips => {
    publicTrips = trips;
    console.log("trips", trips);
    let startingPoints = getStartingPoints(publicTrips);
    TripFactory.getFirebasePlaces(startingPoints)
    .then(fbPlaces => {
      console.log("fbPlaces", fbPlaces);
      let userPlaces = formatPlaceData(fbPlaces);
      return GMapsFactory.getGooglePlaces(userPlaces);
    })
    .then(googlePlaces => {
      console.log("google places", googlePlaces);
      let tripsWithStartingPoints = addStartingPoints(googlePlaces);
      console.log("trips with starting points", startingPoints);
      $scope.trips = tripsWithStartingPoints;
      $scope.mapCenter = tripsWithStartingPoints[0].startingPoint;
    });

    $scope.setMapCenter = (trip) => {
      console.log("starting point", trip.startingPoint);
      $scope.mapCenter = trip.startingPoint;
    };
    

  }); 
});