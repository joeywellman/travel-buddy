'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";
  const tripLocations = [];
  const searchResults = [];
  const placeIds = [];

// passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
    .then(places => {
      return GMapsFactory.getPlaceDetails(places);
    })
    .then(placeDetails => {
      let formattedPlaces = formatPlaces(placeDetails);
      $scope.searchResults = formattedPlaces;
    });
  };

// destructures data and adds image key to places 
  function formatPlaces(placeData){
    const formattedPlaces = placeData.map(place => {
      addImageKey(place.data.result);
      return place.data.result;
    });
    return formattedPlaces;
  }

  function addImageKey(placeObject){
    if (placeObject.photos[0].photo_reference !== null) {
      let imageKey = placeObject.photos[0].photo_reference;
      placeObject.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
    }
  }



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
      TripFactory.postPlace(place)
      .then(data => {
        placeIds.push(data.data.name);
        // NEED TO BUILD TRIP OBJECT IN THIS .THEN
      });
    });
  };

  // creates a trip object from $scope inputs, adds an array of location ids
  // returns a trip object
  const buildTripObject = () => {
    console.log("place ids from within build trip obect", placeIds); // evaluated after! this is not actually posting to firebase
    $scope.trip.locations = placeIds;
    $scope.trip.uid = firebase.auth().currentUser.uid;
    console.log("this is what's getting posted to firebase, should have firebase ids attached", $scope.trip);
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