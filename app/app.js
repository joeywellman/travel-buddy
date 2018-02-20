'use strict';

angular
  .module("TravelBuddy", ['ngRoute', 'ngMap'])
  .constant("FBUrl", "https://nss-capstone-75d59.firebaseio.com/")
  .config($routeProvider => {
    $routeProvider
      .when("/home", {
        templateUrl: "partials/home.html",
        controller: "HomepageCtrl"
      })
      .when("/browse", {
        templateUrl: "partials/browse-trips.html",
        controller: "BrowseTripsCtrl"
      })
      .when("/buildtrip", {
        templateUrl: "partials/init-trip.html",
        controller: "InitTripCtrl"
      })
      .when("/buildtrip/search", {
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
        templateUrl: "partials/init-trip.html",
        controller: "EditInitCtrl",
      })
      .when("/edit/search/:tripId", {
        templateUrl: "partials/trip-builder.html",
        controller: "EditTripCtrl",
      })
      .otherwise("/home");
    })
  .run(FBCreds => {
    let authConfig = {
      apiKey: FBCreds.apiKey,
      authDomain: FBCreds.authDomain
    };
    firebase.initializeApp(authConfig);
  });