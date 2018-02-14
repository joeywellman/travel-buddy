'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
  let userPlaces = null;

  

  const setMapCenter = (placeDetails) => {
    let firstLat = placeDetails[0].geometry.location.lat;
    let firstLong = placeDetails[0].geometry.location.lng;
    $scope.mapCenter = `${firstLat}, ${firstLong}`;
  };

  // destructures place data from firebase and adds property of place_id
  // should this go in factory?
  const formatPlaceData = (fbPlaceData) => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  const addDescriptions = (googlePlaces) => {
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
    return TripFactory.getFirebasePlaces(tripDetails.locations);
  }))
  .then(fbPlaceData => { // gets place details from firebase
    userPlaces = formatPlaceData(fbPlaceData);
    return GMapsFactory.getGooglePlaces(userPlaces);
  })
  .then(placeDetails => { // gets place details from google places
    let tripLocations = GMapsFactory.formatPlaces(placeDetails);
    tripLocations = addDescriptions(tripLocations);
    $scope.tripLocations = tripLocations;
    setMapCenter(tripLocations);
  });


  $scope.showDetails = function (event, location) {
    console.log("this is the location you're passing in", location);
    $scope.selectedLocation= location;
    $scope.map.showInfoWindow("details", location.id);
  };

  $scope.hideDetail = function () {
    console.log("You hid the marker!");
    $scope.map.hideInfoWindow("details");
  };

  // if this is the current user's trip, edit button appears

  

});