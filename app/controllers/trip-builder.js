'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, $location, TripFactory, GMapsFactory, GMapsCreds, UserFactory, TripBuilderFactory){

  $scope.title = "Build A Trip";
  $scope.route = "#!/buildtrip/search";

  // empty arrays! We'll push things into these later.
  $scope.tripLocations = []; 
  const searchResults = [];

  // If nothing comes up on the search, print an error message
  $scope.errorMessage = "Sorry, it looks like we couldn't find anything matching that search! Here are some helpful tips:";
  $scope.hints = ["Make sure you spelled everything correctly.", "Try specifying a type of place and a location, i.e. 'Donut Shops in New York City' or 'Churches in Paris'", "Search for the name of a specific place, i.e. Wicked Weed Brewing"];
  
  // helper variables that control what's visible in the template
  $scope.isCollapsed = false;
  $scope.reviewButtonText = "View Reviews";
  let reviewsLength = null;
  $scope.tripLoaded = true;
  $scope.searchResultsLoading = false;
  
  // TripBuilderFactory stores the trip name, description, etc from trip-init view
  $scope.trip = TripBuilderFactory;


// PLACES SEARCH //

// passes user search into google maps api calls, fetches search results and then details for each search result
  $scope.searchPlaces = (event) => {
    if (event.keyCode == 13) {   
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
    }
  };

  // hides or shows reviews
  $scope.toggleReviews = (result) => {
    reviewsLength = result.reviews.length;
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.reviewButtonText = "Hide Reviews";
  };

  // hides all the reviews except the one you're looking at
  $scope.isCurrent = ($index) => {
    if ($index == $scope.currentIndex){
      return true;
    } else{
      return false;
    }
  };

  // shows the next review
  $scope.nextReview = () => {
    $scope.currentIndex += 1;
    if ($scope.currentIndex === reviewsLength){
      $scope.currentIndex = 0;
    }
  };
  
  // fired when user clicks 'add to trip' button on a place card, pushes place object into global array
  $scope.addToTrip = (place) => {
    $scope.tripLocations.push(place);
  };

  // sets photo url as cover photo property on trip object
  $scope.setCoverPhoto = (tripLocation) => {
    $scope.trip.trip.coverPhoto = tripLocation.image;
  };

  // move tripLocation up
  $scope.moveUp = (tripLocation, index) => {
    $scope.tripLocations[index] = $scope.tripLocations[index-1];
    $scope.tripLocations[index-1] = tripLocation;
  };

  // move tripLocation down
  $scope.moveDown = (tripLocation, index) => {
    $scope.tripLocations[index] = $scope.tripLocations[index+1];
    $scope.tripLocations[index+1] = tripLocation;
  };

  // delete tripLocation
  $scope.removeFromTrip = (index) => {
    $scope.tripLocations.splice(index, 1);
  };

  // creates place object for each trip location and posts to firebase
  $scope.buildPlaceObjects = () => {
    const placeObjects = $scope.tripLocations.map(location => {
      location = {
        description: location.description,
        id: location.place_id
      };
      return location;
    });
    return placeObjects;
  };

  // takes firebase id from POST, returns array of fb ids
  $scope.getFirebaseIds = (fbPostData) => {
    let ids = fbPostData.map(post => {
      post = post.data.name;
      return post;
    });
    return ids;
  };

  //adds locations, uid, and privacy status to trip objects
  $scope.buildTripObject = (placeIds, status) => {
    $scope.trip.trip.locations = placeIds;
    $scope.trip.trip.startingPoint = $scope.tripLocations[0].formatted_address; // also need to test!!
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
    const fbPlaces = $scope.buildPlaceObjects();
    TripFactory.postPlaces(fbPlaces)
      .then(fbData => {
        let placeIds = $scope.getFirebaseIds(fbData);
        const trip = $scope.buildTripObject(placeIds, status);
        return TripFactory.postTrip(trip);
      })
      .then((data)=> {
        $scope.trip.trip = null;
        $location.url("/browse");
      });
  };

  // if the user isn't logged in, log them in before posting trip
  const loginAndPost = (status) => {
    if (firebase.auth().currentUser !== null) {
      postTrip(status);
    } else {
      UserFactory.login()
        .then(() => {
          postTrip(status);
        });
    }
  };

  $scope.saveTrip = () => {
    loginAndPost("private");
  };

  $scope.publishTrip = () => {
    loginAndPost("public");
  };

});