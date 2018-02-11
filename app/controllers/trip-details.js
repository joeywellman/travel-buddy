'use strict';
angular.module("TravelBuddy").controller("TripDetailsCtrl", function ($scope, TripFactory, $routeParams, GMapsCreds, GMapsFactory, NgMap) {

  const tripLocations = [];
  const firebasePlaces = []; 
  let location = {}; 



// eventually this needs to go in a factory I think
  TripFactory.getTripDetails($routeParams.tripId)
    .then(trip => {
      $scope.trip = trip;
      let locations = trip.locations;
      locations.forEach(locationId => {
        firebasePlaces.push(TripFactory.getPlaceDetails(locationId));
      });
      return Promise.all(firebasePlaces); // array of promises to get firebase place details
    })
    .then(placeDetails => {
      placeDetails.forEach(placeObject => { // this will fix itself once we query by firebase keys rather than place ids
        for (let place in placeObject){
          // place.description = placeObject[place].description;
          GMapsFactory.getPlaceInfo(placeObject[place].id)
          .then(placeDetails => {
            location.address = placeDetails.data.result.formatted_address;
            location.name = placeDetails.data.result.name;
            if (placeDetails.data.result.photos[0].photo_reference !== null) {
              let imageKey = placeDetails.data.result.photos[0].photo_reference;
              location.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
            }
            tripLocations.push(location);
            $scope.tripLocations = tripLocations;
            });
          }
        });
      });
  

  

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