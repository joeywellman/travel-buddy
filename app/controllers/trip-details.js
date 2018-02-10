'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
// eventually this needs to go in a factory I think
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
                });
            }
          });
      });
      console.log("trip locations", tripLocations);
      $scope.tripLocations = tripLocations;
    });

  $scope.center = "41,-87";

  

  // let user = firebase.auth().currentUser.uid;

  // FbFactory.getPastStays(user)
  //   .then((stays) => {
  //     $scope.stays = stays;
  //     console.log("data received by stayMap controller", stays);
  //   });


  // $scope.showDetail = function (e, selectedStay) {
  //   $scope.selectedStay = selectedStay;
  //   // console.log("What is selectedStay", $scope.selectedStay.stayId);
  //   $scope.map.showInfoWindow("stayInfoWindow", selectedStay.stayId);
  // };

  // $scope.hideDetail = function () {
  //   $scope.map.hideInfoWindow("stayInfoWindow");
  // };


  // TripFactory.getTripDetails($routeParams.tripId)
  // should get back one trip object
  // set to scope

  //loop through place array, pass each place into TripFactory.getPlaceDetails
  // pass gmaps id to map

  // on click --> add to Faves(uid, tripId)

  // if this is the current user's trip, edit button appears

  

});