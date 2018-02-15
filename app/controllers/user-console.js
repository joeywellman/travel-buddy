'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {
  const favoriteTrips = [];

  // grabs first location from each trip's location array
  const getStartingPoints = (trips) => {
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  // adds starting point addresses onto trips
  const addImages = (googlePlaces, tripArray) => {
    console.log("trip Array should have diff cover photo", tripArray);
    let tripsWithStartingPoints = tripArray.map((trip, index) => {
      trip.startingPoint = googlePlaces[index].data.result;
      let imageKey = trip.startingPoint.photos[0].photo_reference;
      trip.coverImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
      return trip;
    });
    console.log("trips with starting points", tripsWithStartingPoints);
    return tripsWithStartingPoints;
  };

  // this is wonky function that solves a bug with place.id vs place.place_id, need to refactor
  const formatPlaceData = (fbPlaceData) => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };

  const addCoverPhotos = (tripArray, typeOfTrip) => {
    let startingPoints = getStartingPoints(tripArray);
    TripFactory.getFirebasePlaces(startingPoints) // gets firebase places for each starting point
      .then(fbPlaces => {
        let userPlaces = formatPlaceData(fbPlaces); // formats place data
        return GMapsFactory.getGooglePlaces(userPlaces); // gets google place details from each firebase place
      })
      .then(googlePlaces => {
        $scope.dataLoaded = true;
        let tripsWithCoverPhotos = addImages(googlePlaces, tripArray); // adds google place data as a property on the trip object
        if (typeOfTrip == "fave"){
          $scope.faves = tripsWithCoverPhotos;
        } else if (typeOfTrip == "myTrip"){
          $scope.trips = tripsWithCoverPhotos;
        }
        
      });
  };


  function convertToArray(dataObject) {
    const dataArray = [];
   for (let data in dataObject){
      dataArray.push(dataObject[data]);
   }
    return dataArray;
  } 

        

  const getFavorites = (user) => {
    TripFactory.getMyFavorites(user.uid)
    .then(favorites => {
      favorites = convertToArray(favorites);
      return TripFactory.getMultipleTrips(favorites);
    })
    .then(tripData => {
      tripData = tripData.map(trip => {
        trip = trip.data;
        return trip;
      });
      console.log("this should be destructured", tripData);
      addCoverPhotos(tripData, "fave");
    });
  };


  // fetches trips and favorites when user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(user.uid)
      .then((trips) => {
        console.log("trips you get back from get my trips", trips);
        addCoverPhotos(trips, "myTrip");
        getFavorites(user);
      });
    } else {
      $scope.errorMessage = "Please log in to see your trips!";
    }
  });

  // delete trip and then re-fetch trips
  $scope.deleteTrip = (tripId) => {
    TripFactory.deleteTrip(tripId)
    .then(() => {
      TripFactory.getMyTrips(firebase.auth().currentUser.uid)
      .then((trips) => {
        $scope.trips = trips;
      });
    });
  };

  // delete fave and then re-fetch fave
  $scope.deleteFave = (fave) => {
    TripFactory.deleteFave(fave.fbId)
    .then(() => {
      TripFactory.getMyFavorites(firebase.auth().currentUser.uid)
      .then((faves) => {
        $scope.faves = faves;
      });
    });
  };

});