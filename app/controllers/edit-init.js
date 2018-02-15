'use strict';

angular.module("TravelBuddy").controller("EditInitCtrl", function ($scope, $routeParams, TripBuilderFactory, TripFactory) {
  $scope.title = "Let's make some changes.";
  $scope.route = `#!/edit/search/${$routeParams.tripId}`;
  TripFactory.getTripDetails($routeParams.tripId)
    .then(tripDetails => {
      tripDetails.tags = tripDetails.tags.join(', ');
      TripBuilderFactory.trip = tripDetails;
      $scope.trip = TripBuilderFactory;
    });
  });