'use strict';

angular.module("TravelBuddy").controller("EditInitCtrl", function ($scope, $routeParams, TripBuilderFactory, TripFactory) {
  $scope.title = "Let's make some changes.";
  $scope.route = `#!/edit/search/${$routeParams.tripId}`; // where the onward button will take you

  // accoutns for trips that were created before ng-tags-input was added
  // converts array of strings into array of objects for ng-tags to print
  const convertTags = (trip) => {
    if (trip.tags.length > 0 && trip.tags[0] !== null && typeof trip.tags[0] === 'string'){
      let formattedTags = trip.tags.map(tag => {
        tag = {text: tag};
        return tag;
      });
      trip.tags = formattedTags;
    }
    return trip;
  };

  // get trip info from firebase and set it to global TripBuilderFactory obj so it can be accessed in this controller and in TripBuilderCtrl
  TripFactory.getTripDetails($routeParams.tripId)
    .then(tripDetails => {
      tripDetails = convertTags(tripDetails);
      TripBuilderFactory.trip = tripDetails;
      $scope.trip = TripBuilderFactory;
    });
  });