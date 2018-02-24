'use strict';
angular.module("TravelBuddy").controller("HomepageCtrl", function ($scope, GMapsFactory, TripFactory, NgMap, GMapsCreds) {

  $scope.mapCenter = "35, 82";

  // converts tags from array to strings
  const sliceTags = (trips) => {
    let tripsWithTags = trips.map(trip => {
      if (trip.tags[0] !== null && typeof trip.tags[0] === 'object'){ // if tags were created with ng-tag
        trip.tags = trip.tags.map(tag => {
          tag = tag.text;
          return tag;
        });
        trip.tags = trip.tags.join(', ');
        return trip;
      } else{
        trip.tags = trip.tags.join(', ');
        return trip;
      }
    });
    return tripsWithTags;
  };


    // defines a function that gets all public trips and formats them with starting points and cover photos
  $scope.getTrips = () => {
    TripFactory.getAllPublicTrips()
      .then(trips => {
        console.log("should have trip ids", trips);
        $scope.trips = sliceTags(trips);
        $scope.dataLoaded = true;
      });
  };

  // show infowindow, fired on marker click
  $scope.showDetails = function (event, trip) {
    $scope.selectedTrip = trip;
    $scope.map.showInfoWindow("details", trip.startingPoint);
  };

  // hide infowindow
  $scope.hideDetail = function () {
    $scope.map.hideInfoWindow("details");
  };

  
  $scope.getTrips();


});