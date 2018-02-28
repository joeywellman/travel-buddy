'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, $controller, $routeParams, TripFactory, TripBuilderFactory, GMapsFactory, GMapsCreds, $location) {
  
  $scope.title = "Edit Your Trip";
  const searchResults = [];
  let reviewsLength = null;
  let userPlaces = null;
  $scope.isCollapsed = false;


  // inherits places search and functions that let users toggle through search result reviews
  // inherits add to trip, remove from trip, and rearrange order
  $controller("TripBuilderCtrl", { $scope: $scope });

  // adds creator's descriptions to trip locations
  const addDescriptions = (googlePlaces) => {
    let placesWithDescriptions = googlePlaces.map((place, index) => {
      place.description = userPlaces[index].description;
      return place;
    });
    return placesWithDescriptions;
  };
  
  // destructures place data from firebase and adds property of place_id
  const formatPlaceData = fbPlaceData => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  // fetches place info for the trip you're editing
  TripFactory.getFirebasePlaces(TripBuilderFactory.trip.locations)
    .then(fbPlaceData => { // gets place details from firebase
      userPlaces= formatPlaceData(fbPlaceData);
      return GMapsFactory.getGooglePlaces(userPlaces);
    })
    .then(placeDetails => { // gets place details from google places
      $scope.tripLoaded = true;
      let googlePlaces = GMapsFactory.formatPlaces(placeDetails);
      $scope.tripLocations = addDescriptions(googlePlaces);
    });



  // posts places, updates trip
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
