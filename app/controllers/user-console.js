'use strict';
angular.module("TravelBuddy").controller("UserConsoleCtrl", function ($scope, $controller, TripFactory, GMapsFactory, GMapsCreds) {
  const favoriteTrips = [];

  // inherits delete favorite function from browse trips controller
  $controller("BrowseTripsCtrl", { $scope: $scope });

  $scope.getTrips();

  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if (user && $scope.trips !== null) {
      $scope.getFavorites(user.uid);
      $scope.checkUser(user.uid);
    } else {
      $scope.getTrips();
    }
  });
  
  
//   // converts firebase data to array and adds firebase key 
//  const convertToArray = (dataObject) => {
//     let keys = Object.keys(dataObject);
//     let dataArray = keys.map(key => {
//       dataObject[key].fbId = key;
//       return dataObject[key];
//     });
//     return dataArray;
//   };

//   // defines a function that gets the user's favorite trips
//   const getFavorites = (user) => {
//     TripFactory.getMyFavorites(user.uid)
//       .then(favorites => {
//         favorites = convertToArray(favorites);
//         return TripFactory.getFavoriteDetails(favorites);
//       })
//       .then(faveDetails => {
//         faveDetails = faveDetails.map(fave => {
//           fave = fave.data;
//           return fave;
//         });
//         $scope.faves = faveDetails;
//         console.log("scope.faves", $scope.faves);
//       });
//   };


//   // fetches trips and favorites when user is logged in
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       TripFactory.getMyTrips(user.uid)
//       .then(trips => {
//         $scope.trips = trips;
//         getFavorites(user);
//       });
//     } else {
//       $scope.errorMessage = "Please log in to see your trips!";
//     }
//   });

//   // delete trip and then re-fetch trips
//   $scope.deleteTrip = (tripId) => {
//     TripFactory.deleteTrip(tripId)
//     .then(() => {
//       TripFactory.getMyTrips(firebase.auth().currentUser.uid)
//       .then(trips => {
//         $scope.trips = trips;
//       });
//     });
//   };

//   $scope.deleteFave = (faveId) => {
//     TripFactory.deleteFave(faveId)
//     .then(data => {
//       getFavorites(firebase.auth().currentUser);
//     });
//   };

  


});