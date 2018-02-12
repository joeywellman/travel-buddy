'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, TripFactory, $routeParams, GMapsFactory, GMapsCreds, $location) {
  $scope.title = "Edit Your Trip";
  const tripLocations = [];
  const searchResults = [];

// TODO: figure out why getPlaceDetails returns two objects with the same place id? it's calling for google place id, not firebase id, which is weird...
// need to return some shit here
  TripFactory.getTripDetails($routeParams.tripId)
  .then(trip => {
    $scope.trip = trip;
    let locations = trip.locations;
    locations.forEach((locationId) => {
      TripFactory.getPlaceDetails(locationId)
      .then((placeDetails) => {
        GMapsFactory.getPlaceInfo(placeDetails.id)
          .then(placeInfo => {
            if (placeInfo.data.result.photos[0].photo_reference !== null) {
              let imageKey = placeInfo.data.result.photos[0].photo_reference;
              placeInfo.data.result.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
            }
            tripLocations.push(placeInfo.data.result);
          });
      });
    });
    $scope.tripLocations = tripLocations;
  });



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
    tripLocations.forEach((location) => {
      // need to refactor so it doesn't just add all the places again??? add a property of new place to place object?
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
    console.log("this is the trip that you're putting", trip);
    console.log("this is the trip id", $routeParams.tripId);
    TripFactory.updateTrip(trip, $routeParams.tripId)
      .then((data) => {
        $location.url("/browse");
      });
  };

  //saves all places in trip
  // sets trip as PUBLIC
  // post trip to firebase
  $scope.publishTrip = () => {
    savePlaceObjects();
    let trip = buildTripObject();
    trip.private = false;
    TripFactory.updateTrip(trip, trip.id)
      .then((data) => {
        $location.url("/browse");
      });
  };

});
