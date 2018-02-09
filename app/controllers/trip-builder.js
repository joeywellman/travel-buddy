'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";
  const tripLocations = [];
  const searchResults = [];


  // PLACES SEARCH
  // fires on search button click
  // passes in input from search box and feeds into Google Places Web Service Text Search
  // resolves an array of places
  // adds property of photo link to each place object
  // sets places array to scope variable

  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
      .then((places) => {
        places.forEach((place) => {
          GMapsFactory.getPlaceInfo(place.place_id)
          .then(placeDetails => {
            if (placeDetails.data.result.photos[0].photo_reference !== null) {
              let imageKey = place.photos[0].photo_reference;
              placeDetails.data.result.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
            }
            searchResults.push(placeDetails.data.result);
          });
        });
        $scope.searchResults = searchResults;
      });
  };

  // fired when user clicks 'add to trip' button on a place card
  // pushes place object into global array 
  $scope.addToTrip = (place) => {
    tripLocations.push(place);
    // TODO: add buttons to reorder trip
    $scope.tripLocations = tripLocations;
  };
  
  // creates place object for each location in the trip (description and google place id)
  // posts each place object to firebase 
  const savePlaceObjects = () => {
    tripLocations.forEach ((location) => {
      let place = {
        description: location.description,
        id: location.place_id
      };
      TripFactory.postPlace(place);
    });
  };

  // creates a trip object from $scope inputs, adds an array of location ids
  // returns a trip object
  const buildTripObject = () => {
    // $scope.trip.uid = firebase.auth().currentUser.uid;
    const tripIds = tripLocations.map(location => {
      location = location.place_id;
      return location;
    });
    $scope.trip.locations = tripIds; // right now this is google place ids, could it be firebase ids at some point? should it be?
    $scope.trip.uid = firebase.auth().currentUser.uid;
    return $scope.trip;
  };


  // saves all places in trip
  // sets trip as PRIVATE
  // posts trip to Firebase
  $scope.saveTrip = () => {
    savePlaceObjects();
    let trip = buildTripObject();
    trip.private = true;
    TripFactory.postTrip(trip)
    .then((data) => {
      $location.url("/browse");
    });
    // TODO: print a success message or load a new route?
  };

  //saves all places in trip
  // sets trip as PUBLIC
  // post trip to firebase
  $scope.publishTrip = () => {
    savePlaceObjects();
    let trip = buildTripObject();
    trip.private = false;
    TripFactory.postTrip(trip)
    .then((data) => {
      $location.url("/browse");
    });
    // TODO: print a success message or load a new route?
  };

});