'use strict';
angular.module("TravelBuddy").controller("HomepageCtrl", function ($scope, GMapsFactory, TripFactory, NgMap, GMapsCreds) {

  let publicTrips = null;

  // grabs first location from each trip's location array
  const getStartingPoints = (trips) => {
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  // adds starting point addresses onto trips
  const addStartingPoints = (googlePlaces) => {
    let tripsWithStartingPoints = publicTrips.map((trip, index) => {
      trip.startingPoint = googlePlaces[index].data.result;
      let imageKey = trip.startingPoint.photos[0].photo_reference;
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

  // converts tags from array to strings
  const sliceTags = (trips) => {
    let tripsWithTags = trips.map(trip => {
      trip.tags = trip.tags.join(', ');
      return trip;
    });
    return tripsWithTags;
  };

  // gets all public trips to display on map
  TripFactory.getAllPublicTrips()
    .then(trips => {
      publicTrips = trips;
      let startingPoints = getStartingPoints(publicTrips); // grabs first firebase place id from each trip
      TripFactory.getFirebasePlaces(startingPoints) // gets firebase places for each starting point
        .then(fbPlaces => {
          let userPlaces = formatPlaceData(fbPlaces); // formats place data
          return GMapsFactory.getGooglePlaces(userPlaces); // gets google place details from each firebase place
        })
        .then(googlePlaces => {
          $scope.dataLoaded = true;
          let tripsWithStartingPoints = addStartingPoints(googlePlaces); // adds google place data as a property on the trip object
          tripsWithStartingPoints = sliceTags(tripsWithStartingPoints); // converts tags into strings from array
          $scope.trips = tripsWithStartingPoints; // sets variable to scope
          $scope.mapCenter = tripsWithStartingPoints[0].startingPoint.formatted_address; // center map to first location
        });
    });

  // $scope.setMapCenter = (trip) => {
  //   $scope.mapCenter = trip.startingPoint.formatted_address;
  // };

  $scope.showDetails = function (event, trip) {
    $scope.selectedTrip = trip;
    $scope.map.showInfoWindow("details", trip.startingPoint.place_id);
  };

  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("details");
  };


});