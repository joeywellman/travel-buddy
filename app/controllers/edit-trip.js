'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, TripFactory, $routeParams, TripBuilderFactory, GMapsFactory, GMapsCreds, $location) {
  $scope.title = "Edit Your Trip";
  $scope.trip = TripBuilderFactory;
  console.log("scope.trip right when page loads", $scope.trip);
  const searchResults = [];
  let tripLocations = TripBuilderFactory.trip.locations;
  let reviewsLength = null;

  $scope.errorMessage = "Sorry, it looks like we couldn't find anything matching that search! Here are some helpful tips:";
  $scope.hints = ["Make sure you spelled everything correctly.", "Try specifying a type of place and a location, i.e. 'Donut Shops in New York City' or 'Churches in Paris'", "Search for the name of a specific place, i.e. Wicked Weed Brewing"];
  $scope.isCollapsed = false;
  $scope.reviewButtonText = "View Reviews";
 
  

  // destructures place data from firebase and adds property of place_id
  const formatPlaceData = fbPlaceData => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  TripFactory.getFirebasePlaces(tripLocations)
    .then(fbPlaceData => { // gets place details from firebase
      let formattedData = formatPlaceData(fbPlaceData);
      return GMapsFactory.getGooglePlaces(formattedData);
    })
    .then(placeDetails => { // gets place details from google places
      $scope.tripLoaded = true;
      tripLocations = GMapsFactory.formatPlaces(placeDetails);
      $scope.tripLocations = tripLocations;
    });

  // passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
      .then(places => {
        return GMapsFactory.getGooglePlaces(places); // returns an array of promises
      })
      .then(placeDetails => {
        $scope.searchResultsLoaded = true;
        let searchResults = GMapsFactory.formatPlaces(placeDetails);
        $scope.searchResults = searchResults;
        $scope.currentIndex = 0;
      });
  };

  $scope.toggleReviews = result => {
    reviewsLength = result.reviews.length;
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.reviewButtonText = "Hide Reviews";
  };

  $scope.isCurrent = $index => {
    if ($index == $scope.currentIndex) {
      return true;
    } else {
      return false;
    }
  };

  $scope.nextReview = () => {
    $scope.currentIndex += 1;
    if ($scope.currentIndex === reviewsLength) {
      $scope.currentIndex = 0;
    }
  };


  // fired when user clicks 'add to trip' button on a place card, pushes place object into global array
  $scope.addToTrip = place => {
    tripLocations.push(place);
    $scope.tripLocations = tripLocations;
  };


  $scope.moveUp = (tripLocation, index) => {
    tripLocations[index] = tripLocations[index - 1];
    tripLocations[index - 1] = tripLocation;
  };

  $scope.moveDown = (tripLocation, index) => {
    tripLocations[index] = tripLocations[index + 1];
    tripLocations[index + 1] = tripLocation;
  };

  $scope.removeFromTrip = index => {
    tripLocations.splice(index, 1);
  };

  const buildPlaceObjects = () => {
    const placeObjects = tripLocations.map(location => {
      location = {
        description: location.description,
        id: location.place_id
      };
      return location;
    });
    return placeObjects;
  };

  // takes firebase id from POST, returns array of fb ids
  const getFirebaseIds = (fbPostData) => {
    let ids = fbPostData.map(post => {
      post = post.data.name;
      return post;
    });
    return ids;
  };

  //adds locations, uid, and privacy status to trip objects
  const buildTripObject = (placeIds, status) => {
    $scope.trip.trip.locations = placeIds;
    $scope.trip.trip.uid = firebase.auth().currentUser.uid;
    if ($scope.trip.trip.tags.indexOf(", ") > -1) {
      $scope.trip.trip.tags = $scope.trip.trip.tags.split(', ');
    }
    if (status == "private") {
      $scope.trip.trip.private = true;
    } else if (status == "public") {
      $scope.trip.trip.private = false;
    }
    return $scope.trip.trip;
  };

  // posts places, grabs fb ids of places, posts trip
  const postTrip = (status) => {
    const fbPlaces = buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = getFirebaseIds(fbData);
        const trip = buildTripObject(placeIds, status);
        return TripFactory.updateTrip(trip, $routeParams.tripId);
      })
      .then((data) => {
        $location.url("/browse");
      });
  };


  $scope.saveTrip = () => {
    postTrip("private");
  };

  $scope.publishTrip = () => {
    postTrip("public");
  };


});
