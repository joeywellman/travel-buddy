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
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  // adds starting point addresses onto trips
  const addStartingPoints= (googlePlaces) => {
    let tripsWithStartingPoints = publicTrips.map((trip, index) => {
      trip.startingPoint = googlePlaces[index].data.result.formatted_address;
      let imageKey = googlePlaces[index].data.result.photos[0].photo_reference;
      trip.coverPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
      return trip;
    });
    return tripsWithStartingPoints;
  };

  // this is wonky function that solves a bug with place.id vs place.place_id, need to refactor
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
    TripFactory.getFirebasePlaces(startingPoints)
    .then(fbPlaces => {
      let userPlaces = formatPlaceData(fbPlaces);
      return GMapsFactory.getGooglePlaces(userPlaces);
    })
    .then(googlePlaces => {
      let tripsWithStartingPoints = addStartingPoints(googlePlaces);
      $scope.trips = tripsWithStartingPoints;
      $scope.mapCenter = tripsWithStartingPoints[0].startingPoint;
    });

    $scope.setMapCenter = (trip) => {
      $scope.mapCenter = trip.startingPoint;
    };
    

  }); 
});