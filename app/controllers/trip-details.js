'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
  // const firebasePlaces = []; 
  // let location = {}; 
  

  // TODO: this needs to print descriptions too!
  TripFactory.getTripDetails($routeParams.tripId)
    .then(trip => {
      $scope.trip = trip;
      let locations = trip.locations;
      locations.forEach((locationId) => {
        TripFactory.getPlaceDetails(locationId)
          .then((placeDetails) => {
            for (let place in placeDetails) {
              GMapsFactory.getPlaceInfo(placeDetails[place].id)
                .then(placeInfo => {
                  if (placeInfo.data.result.photos[0].photo_reference !== null) {
                    let imageKey = placeInfo.data.result.photos[0].photo_reference;
                    placeInfo.data.result.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
                  }
                  tripLocations.push(placeInfo.data.result);
                  console.log(tripLocations[0]);
                  let firstLat = tripLocations[0].geometry.location.lat;
                  let firstLong = tripLocations[0].geometry.location.lng;
                  $scope.mapCenter = `${firstLat}, ${firstLong}`;
                  $scope.tripLocations = tripLocations; // this shouldn't be in a loop! aaaaaahh
                });
              }
          });
        });
      });



  $scope.showDetail = function (e, selectedLocation) {
    $scope.selectedLocation= selectedLocation;
    $scope.map.showInfoWindow("locationDetails", selectedLocation.id);
  };

  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("locationDetails");
  };


  // on click --> add to Faves(uid, tripId)

  // if this is the current user's trip, edit button appears

  

});