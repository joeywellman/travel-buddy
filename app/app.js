'use strict';

angular
  .module("TravelBuddy", ["ngRoute"])
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
    });
  // .config(function (uiGmapGoogleMapApiProvider) {
  //   uiGmapGoogleMapApiProvider.configure({
  //     key: ,
  //     v: '3.20',
  //     libraries: 'places'
  //   });
  // })
  // .run(FBCreds => {
  //   let authConfig = {
  //     apiKey: FBCreds.key,
  //     authDomain: FBCreds.authDomain
  //   };
  //   firebase.initializeApp(authConfig);
  // });