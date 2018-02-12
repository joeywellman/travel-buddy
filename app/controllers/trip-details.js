'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
  // const firebasePlaces = []; 
  // let location = {}; 
  

  const setMapCenter = (placeDetails) => {
    let firstLat = placeDetails[0].geometry.location.lat;
    let firstLong = placeDetails[0].geometry.location.lng;
    $scope.mapCenter = `${firstLat}, ${firstLong}`;
  };

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
    console.log("trip details", tripDetails);
    $scope.trip = tripDetails;
    return TripFactory.getFirebasePlaces(tripDetails.locations);
  }))
  .then(fbPlaceData => {
    console.log("fbPlaceData", fbPlaceData);
    let formattedData = formatPlaceData(fbPlaceData);
    console.log("formatted data", formattedData);
    return GMapsFactory.getGooglePlaces(formattedData);
  })
  .then(placeDetails => {
    console.log("google palce details", placeDetails);
    let tripLocations = GMapsFactory.formatPlaces(placeDetails);
    console.log("trip locations", tripLocations);
    $scope.tripLocations = tripLocations;
    setMapCenter(tripLocations);
  });


  $scope.showDetails = function (event, location) {
    $scope.selectedLocation= location;
    $scope.map.showInfoWindow(event, 'details');
  };

  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("locationDetails");
  };


  // on click --> add to Faves(uid, tripId)

  // if this is the current user's trip, edit button appears

  

});