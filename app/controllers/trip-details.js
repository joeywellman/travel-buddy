'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
  // const firebasePlaces = []; 
  // let location = {}; 
  

  // TODO: this needs to print descriptions too!
  TripFactory.getTripDetails($routeParams.tripId)
    .then(trip => {
      $scope.trip = trip;
      console.log("this is the trip", trip);
      let locations = trip.locations;
      console.log("this is locations", locations);
      locations.forEach((locationId) => {
        TripFactory.getPlaceDetails(locationId)
          .then((placeDetails) => {
            console.log("this should be place details", placeDetails);
            GMapsFactory.getPlaceInfo(placeDetails.id)
              .then(placeInfo => {
                if (placeInfo.data.result.photos[0].photo_reference !== null) {
                  let imageKey = placeInfo.data.result.photos[0].photo_reference;
                  placeInfo.data.result.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
                }
                tripLocations.push(placeInfo.data.result);
                let firstLat = tripLocations[0].geometry.location.lat;
                let firstLong = tripLocations[0].geometry.location.lng;
                $scope.mapCenter = `${firstLat}, ${firstLong}`;
                $scope.tripLocations = tripLocations; // this shouldn't be in a loop! aaaaaahh
              });
        });
        });
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