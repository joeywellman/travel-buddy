'use strict';

angular
  .module("TravelBuddy", ['ngRoute', 'ngMap'])
  .constant("FBUrl", "https://nss-capstone-75d59.firebaseio.com/")
  .config($routeProvider => {
    $routeProvider
      .when("/browse", {
        templateUrl: "partials/browse-trips.html",
        controller: "BrowseTripsCtrl"
      })
      .when("/buildtrip", {
        templateUrl: "partials/trip-builder.html",
        controller: "TripBuilderCtrl"
      })
      .when("/view/:tripId", {
        templateUrl: "partials/trip-details.html",
        controller: "TripDetailsCtrl",

      })
      .when("/mytrips", {
        templateUrl: "partials/user-console.html",
        controller: "UserConsoleCtrl",
      })
      .when("/edit/:tripId", {
        templateUrl: "partials/trip-builder.html",
        controller: "EditTripCtrl",
      })
      .otherwise("/browse");
    })
  .run(FBCreds => {
    let authConfig = {
      apiKey: FBCreds.key,
      authDomain: FBCreds.authDomain
    };
    firebase.initializeApp(authConfig);
  });