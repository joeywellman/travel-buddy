'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, $controller, $routeParams, TripFactory, TripBuilderFactory, GMapsFactory, GMapsCreds, $location) {
  $controller("TripBuilderCtrl", { $scope: $scope });
  // inherits places search and functions that let users toggle through search result reviews
  // inherits add to trip, remove from trip, and rearrange order
  
  $scope.title = "Edit Your Trip";
  const searchResults = [];
  let reviewsLength = null;
  $scope.isCollapsed = false;
 

  // destructures place data from firebase and adds property of place_id
  const formatPlaceData = fbPlaceData => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  TripFactory.getFirebasePlaces(TripBuilderFactory.trip.locations)
    .then(fbPlaceData => { // gets place details from firebase
      let formattedData = formatPlaceData(fbPlaceData);
      return GMapsFactory.getGooglePlaces(formattedData);
    })
    .then(placeDetails => { // gets place details from google places
      $scope.tripLoaded = true;
      $scope.tripLocations = GMapsFactory.formatPlaces(placeDetails);
    });



  // posts places, grabs fb ids of places, posts trip
  const saveChanges = (status) => {
    const fbPlaces = $scope.buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = $scope.getFirebaseIds(fbData);
        const trip = $scope.buildTripObject(placeIds, status);
        return TripFactory.updateTrip(trip, $routeParams.tripId);
      })
      .then((data) => {
        $location.url("/browse");
      });
  };

  $scope.saveTrip = () => {
    saveChanges("private");
  };

  $scope.publishTrip= () => {
    saveChanges("public");
  };


});
