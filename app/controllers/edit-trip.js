'use strict';
angular.module("TravelBuddy").controller("EditTripCtrl", function ($scope, $controller, $routeParams, TripFactory, TripBuilderFactory, GMapsFactory, GMapsCreds, $location) {
  $controller("TripBuilderCtrl", { $scope: $scope });
  
  $scope.title = "Edit Your Trip";
  // $scope.trip = TripBuilderFactory;
  console.log("scope.trip inherited from trip builder variable", $scope.trip);
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
      console.log("formatted places from firebase", formattedData);
      return GMapsFactory.getGooglePlaces(formattedData);
    })
    .then(placeDetails => { // gets place details from google places
      $scope.tripLoaded = true;
      $scope.tripLocations = GMapsFactory.formatPlaces(placeDetails);
      console.log("triplocations after gmaps places call?", $scope.tripLocations);
    });

  

    

  // passes user search into google maps api calls, fetches search results and then details for each search result
  // $scope.searchPlaces = () => {
  //   GMapsFactory.placesSearch($scope.searchString)
  //     .then(places => {
  //       return GMapsFactory.getGooglePlaces(places); // returns an array of promises
  //     })
  //     .then(placeDetails => {
  //       $scope.searchResultsLoaded = true;
  //       let searchResults = GMapsFactory.formatPlaces(placeDetails);
  //       $scope.searchResults = searchResults;
  //       $scope.currentIndex = 0;
  //     });
  // };

  // $scope.toggleReviews = result => {
  //   reviewsLength = result.reviews.length;
  //   $scope.isCollapsed = !$scope.isCollapsed;
  //   $scope.reviewButtonText = "Hide Reviews";
  // };

  // $scope.isCurrent = $index => {
  //   if ($index == $scope.currentIndex) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // $scope.nextReview = () => {
  //   $scope.currentIndex += 1;
  //   if ($scope.currentIndex === reviewsLength) {
  //     $scope.currentIndex = 0;
  //   }
  // };


  // // fired when user clicks 'add to trip' button on a place card, pushes place object into global array
  // $scope.addToTrip = place => {
  //   tripLocations.push(place);
  //   $scope.tripLocations = tripLocations;
  // };


  // $scope.moveUp = (tripLocation, index) => {
  //   tripLocations[index] = tripLocations[index - 1];
  //   tripLocations[index - 1] = tripLocation;
  // };

  // $scope.moveDown = (tripLocation, index) => {
  //   tripLocations[index] = tripLocations[index + 1];
  //   tripLocations[index + 1] = tripLocation;
  // };

  // $scope.removeFromTrip = index => {
  //   tripLocations.splice(index, 1);
  // };

  // const buildPlaceObjects = () => {
  //   const placeObjects = tripLocations.map(location => {
  //     location = {
  //       description: location.description,
  //       id: location.place_id
  //     };
  //     return location;
  //   });
  //   return placeObjects;
  // };

  // // takes firebase id from POST, returns array of fb ids
  // const getFirebaseIds = (fbPostData) => {
  //   let ids = fbPostData.map(post => {
  //     post = post.data.name;
  //     return post;
  //   });
  //   return ids;
  // };

  // //adds locations, uid, and privacy status to trip objects
  // const buildTripObject = (placeIds, status) => {
  //   $scope.trip.trip.locations = placeIds;
  //   $scope.trip.trip.uid = firebase.auth().currentUser.uid;
  //   if ($scope.trip.trip.tags.indexOf(", ") > -1) {
  //     $scope.trip.trip.tags = $scope.trip.trip.tags.split(', ');
  //   }
  //   if (status == "private") {
  //     $scope.trip.trip.private = true;
  //   } else if (status == "public") {
  //     $scope.trip.trip.private = false;
  //   }
  //   return $scope.trip.trip;
  // };

  // posts places, grabs fb ids of places, posts trip
  const postTrip = (status) => {
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


});
