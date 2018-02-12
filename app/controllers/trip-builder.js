'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";
  const tripLocations = [];
  const searchResults = [];

// passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
    .then(places => {
      return GMapsFactory.getGooglePlaces(places); // returns an array of promises
    })
    .then(placeDetails => {
      $scope.searchResults = GMapsFactory.formatPlaces(placeDetails); 
    });
  };


  // fired when user clicks 'add to trip' button on a place card, pushes place object into global array
  $scope.addToTrip = (place) => {
    tripLocations.push(place);
    // TODO: add buttons to reorder trip
    $scope.tripLocations = tripLocations;
  };

  // creates place object for each location in the trip (description and google place id), posts each place object to firebase 
  const buildPlaceObjects = () => {
    const placeObjects = tripLocations.map(location => {
      location = {
        description: location.description,
        id: location.place_id
      };
      return location;
    });
    return placeObjects;
  };

  // takes firebase id from POST, returns array of fb ids
  const getFirebaseIds = (fbPostData) => {
    let ids = fbPostData.map(post => {
      post = post.data.name;
      return post;
    });
    return ids;
  };

  //adds locations, uid, and privacy status to trip objects
  const buildTripObject = (placeIds, status) => {
    $scope.trip.locations = placeIds;
    $scope.trip.uid = firebase.auth().currentUser.uid;
    $scope.trip.status = status;
    return $scope.trip;
  };

  // posts places, grabs fb ids of places, posts trip
  const postTrip = (status) => {
    const fbPlaces = buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = getFirebaseIds(fbData);
        const trip = buildTripObject(placeIds, status);
        return TripFactory.postTrip(trip);
      })
      .then((data)=> {
        $location.url("/browse");
      });
  };

  $scope.saveTrip = () => {
    postTrip("private");
  };

  $scope.publishTrip = () => {
    postTrip("public");
  };

});