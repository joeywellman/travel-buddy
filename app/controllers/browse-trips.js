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

  const getStartingPoints = (trips) => {
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  const addStartingPoints= (googlePlaces) => {
    let tripsWithStartingPoints = publicTrips.map((trip, index) => {
      trip.startingPoint = googlePlaces[index].data.result.formatted_address;
      console.log("public trip in loop, should have starting point", trip);
      return trip;
    });
    return tripsWithStartingPoints;
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
    publicTrips = trips;
    let startingPoints = getStartingPoints(publicTrips);
    console.log("this should be each trip's starting point", startingPoints);
    TripFactory.getFirebasePlaces(startingPoints)
    .then(fbPlaces => {
      let userPlaces = formatPlaceData(fbPlaces);
      console.log("firebase place details", userPlaces);
      return GMapsFactory.getGooglePlaces(userPlaces);
    })
    .then(googlePlaces => {
      console.log("google places", googlePlaces);
      let tripsWithStartingPoints = addStartingPoints(googlePlaces);
      console.log(tripsWithStartingPoints);
      $scope.trips = tripsWithStartingPoints;
      $scope.mapCenter = tripsWithStartingPoints[0].startingPoint;
    });
    

  }); 
});