'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds, UserFactory, TripBuilderFactory){
  $scope.title = "Build A Trip";
  const tripLocations = [];
  const searchResults = [];
  $scope.errorMessage = "Sorry, it looks like we couldn't find anything matching that search! Here are some helpful tips:";
  $scope.hints = ["Make sure you spelled everything correctly.", "Try specifying a type of place and a location, i.e. 'Donut Shops in New York City' or 'Churches in Paris'", "Search for the name of a specific place, i.e. Wicked Weed Brewing"];
  $scope.isCollapsed = false;
  $scope.reviewButtonText = "View Reviews";
  let reviewsLength = null;
  $scope.tripLoaded = true;
  $scope.searchResultsLoading = false;
  $scope.route = "#!/buildtrip/search";


  $scope.trip = TripBuilderFactory;

// passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = () => {
    $scope.searchResultsLoading = true;
    GMapsFactory.placesSearch($scope.searchString)
    .then(places => {
      return GMapsFactory.getGooglePlaces(places); // returns an array of promises
    })
    .then(placeDetails => {
      let searchResults = GMapsFactory.formatPlaces(placeDetails);
      $scope.searchResultsLoaded = true;
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
    $scope.trip.trip.locations = placeIds;
    $scope.trip.trip.userName = firebase.auth().currentUser.displayName;
    $scope.trip.trip.uid = firebase.auth().currentUser.uid;
    if ($scope.trip.trip.tags.indexOf(", ") > -1){
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
        return TripFactory.postTrip(trip);
      })
      .then((data)=> {
        $scope.trip.trip = null;
        $location.url("/browse");
      });
  };

  // dry these up
  $scope.saveTrip = () => {
    if (firebase.auth().currentUser !== null) {
      postTrip("private");
    }else{
      UserFactory.login()
      .then(()=> {
        postTrip("private");
      });
    }
  };

  $scope.publishTrip = () => {
    if (firebase.auth().currentUser !== null) {
      postTrip("public");
    } else {
      UserFactory.login()
        .then(() => {
          postTrip("public");
        });
    }
  };

});