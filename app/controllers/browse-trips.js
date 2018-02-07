'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, TripFactory, NgMap, GMapsCreds) {
  $scope.title = "This is the Browse All Trips View!";
  $scope.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${GMapsCreds.apiKey}`;
  NgMap.getMap().then(function (map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });

 
 
  

  // TripFactory.getAllTrips
  // set to scope

  // grab first place in each trip's array
  // pass in each place id into TripFactory.getPlaceDetails
  // pass gmaps id into map

 
});