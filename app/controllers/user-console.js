'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {

  const favoriteTrips = [];

  // grabs first location from each trip's location array
  const getStartingPoints = (trips) => {
    console.log("this is whaty you're passing into getStartingPoints", trips);
    let startingPoints = trips.map(trip => {
      let startingPoint = trip.data.locations[0];
      return startingPoint;
    });
    return startingPoints;
  };

  // adds starting point addresses onto trips
  const addImages = (googlePlaces, tripArray) => {
    console.log("google places", googlePlaces);
    console.log("trip array from add images", tripArray);
    let tripsWithStartingPoints = tripArray.map((trip, index) => {
      trip.data.startingPoint = googlePlaces[index].data.result;
      let imageKey = trip.data.startingPoint.photos[0].photo_reference;
      trip.data.coverPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
      return trip.data;
    });
    console.log("trips with starting points from add images function", tripsWithStartingPoints);
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

  const addCoverPhotos = (tripArray) => {
    console.log("trip array going into addCoverPhotos", tripArray);
    let startingPoints = getStartingPoints(tripArray);
    console.log("starting points", startingPoints);
    TripFactory.getFirebasePlaces(startingPoints) // gets firebase places for each starting point
      .then(fbPlaces => {
        let userPlaces = formatPlaceData(fbPlaces); // formats place data
        console.log("user places", userPlaces);
        return GMapsFactory.getGooglePlaces(userPlaces); // gets google place details from each firebase place
      })
      .then(googlePlaces => {
        $scope.dataLoaded = true;
        let tripsWithCoverPhotos = addImages(googlePlaces, tripArray); // adds google place data as a property on the trip object
        console.log("trips with cover photos right before return", tripsWithCoverPhotos);
        $scope.faves = tripsWithCoverPhotos;
      });
  };

  // fetches favorites and details for each favorite -> sets them to scope
  // const getFavorites = (user) => {
  //   TripFactory.getMyFavorites(user.uid)
  //     .then((favoriteData) => {
  //       let fbKeys = Object.keys(favoriteData);
  //       fbKeys.forEach(key => {
  //         TripFactory.getTripDetails(favoriteData[key].id)
  //           .then(tripDetails => {
  //             tripDetails.fbId = key;
  //             favoriteTrips.push(tripDetails);
  //           });

  //       });
  //     });
  //   };

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
      console.log("this is what returns from the favorite call", favorites);
      favorites = convertToArray(favorites);
      return TripFactory.getMultipleTrips(favorites);
    })
    .then(tripData => {
      console.log("tripData", tripData);
      addCoverPhotos(tripData);
    });
  };


  // fetches trips and favorites when user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      TripFactory.getMyTrips(user.uid)
      .then((trips) => {
        $scope.trips = trips;
        getFavorites(user);
      });
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