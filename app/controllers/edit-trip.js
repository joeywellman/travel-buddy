'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, TripFactory, $routeParams, GMapsFactory, GMapsCreds, $location) {
  $scope.title = "Edit Your Trip";
  let tripLocations = [];
  const searchResults = [];

  // destructures place data from firebase and adds property of place_id
  const formatPlaceData = (fbPlaceData) => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  TripFactory.getTripDetails($routeParams.tripId)
    .then((tripDetails => {
      $scope.trip = tripDetails;
      return TripFactory.getFirebasePlaces(tripDetails.locations);
    }))
    .then(fbPlaceData => { // gets place details from firebase
      let formattedData = formatPlaceData(fbPlaceData);
      return GMapsFactory.getGooglePlaces(formattedData);
    })
    .then(placeDetails => { // gets place details from google places
      tripLocations = GMapsFactory.formatPlaces(placeDetails);
      $scope.tripLocations = tripLocations;
    });

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
    if (status == "private"){
      $scope.trip.private = true;
    } else if (status == "public"){
      $scope.trip.private = false;
    }
    return $scope.trip;
  };

  // posts places, grabs fb ids of places, posts trip
  const postTrip = (status) => {
    const fbPlaces = buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = getFirebaseIds(fbData);
        const trip = buildTripObject(placeIds, status);
        return TripFactory.updateTrip(trip, $routeParams.tripId);
      })
      .then((data) => {
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
