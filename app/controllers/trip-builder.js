'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";
  const tripLocations = [];
  const searchResults = [];
  $scope.isCollapsed = false;
  $scope.reviewButtonText = "View Reviews";
  let reviewsLength = null;
  


// passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = () => {
    GMapsFactory.placesSearch($scope.searchString)
    .then(places => {
      return GMapsFactory.getGooglePlaces(places); // returns an array of promises
    })
    .then(placeDetails => {
      let searchResults = GMapsFactory.formatPlaces(placeDetails);
      $scope.searchResults = searchResults;
      $scope.currentIndex = 0;
    });
  };

  $scope.toggleReviews = (result) => {
    reviewsLength = result.reviews.length;
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.reviewButtonText = "Hide Reviews";
  };

  $scope.isCurrent = ($index) => {
    if ($index == $scope.currentIndex){
      return true;
    } else{
      return false;
    }
  };

  $scope.nextReview = () => {
    $scope.currentIndex += 1;
    if ($scope.currentIndex === reviewsLength){
      $scope.currentIndex = 0;
    }
  };
  
  
  // fired when user clicks 'add to trip' button on a place card, pushes place object into global array
  $scope.addToTrip = (place) => {
    tripLocations.push(place);
    $scope.tripLocations = tripLocations;
  };

  $scope.setCoverPhoto = imageURL => {
    $scope.trip.coverPhoto = imageURL;
  };

  $scope.moveUp = (tripLocation, index) => {
    tripLocations[index] = tripLocations[index-1];
    tripLocations[index-1] = tripLocation;
  };

  $scope.moveDown = (tripLocation, index) => {
    tripLocations[index] = tripLocations[index+1];
    tripLocations[index+1] = tripLocation;
  };

  $scope.removeFromTrip = (index) => {
    tripLocations.splice(index, 1);
  };

  // creates place object for each location in the trip (description and google place id), posts each place object to firebase 
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
    $scope.trip.locations = placeIds;
    $scope.trip.uid = firebase.auth().currentUser.uid;
    $scope.trip.tags = $scope.trip.tags.split(', ');
    console.log("tags", $scope.trip.tags);
    if (status == "private") {
      $scope.trip.private = true;
    } else if (status == "public") {
      $scope.trip.private = false;
    }
    console.log("trip", $scope.trip);
    return $scope.trip;
  };

  // posts places, grabs fb ids of places, posts trip
  const postTrip = (status) => {
    const fbPlaces = buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = getFirebaseIds(fbData);
        const trip = buildTripObject(placeIds, status);
        return TripFactory.postTrip(trip);
      })
      .then((data)=> {
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