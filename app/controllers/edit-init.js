'use strict';

angular.module("TravelBuddy").controller("EditInitCtrl", function ($scope, $routeParams, TripBuilderFactory, TripFactory) {
  $scope.title = "Let's make some changes.";
  $scope.route = `#!/edit/search/${$routeParams.tripId}`; // where the onward button will take you

  // get trip info from firebase and set it to global TripBuilderFactory obj so it can be accessed in this controller and in TripBuilderCtrl
  TripFactory.getTripDetails($routeParams.tripId)
    .then(tripDetails => {
      tripDetails.tags = tripDetails.tags.join(', ');
      TripBuilderFactory.trip = tripDetails;
      $scope.trip = TripBuilderFactory;
    });
  });