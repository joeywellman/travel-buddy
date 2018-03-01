'use strict';

angular.module("TravelBuddy").controller("EditInitCtrl", function ($scope, $routeParams, TripBuilderFactory, TripFactory) {
  $scope.title = "Let's make some changes.";
  $scope.route = `#!/edit/search/${$routeParams.tripId}`; // where the onward button will take you

  // accoutns for trips that were created before ng-tags-input was added
  // converts array of strings into array of objects for ng-tags to print
  const convertTags = (trip) => {
    if (trip.tags.length > 0 && trip.tags[0] !== null && typeof trip.tags[0] === 'string'){
      console.log("this is a trip with string tags!", trip);
      let formattedTags = trip.tags.map(tag => {
        console.log("this is a single tag before you format it", tag);
        tag = {text: tag};
        console.log("and now it should be an object", tag);
        return tag;
      });
      trip.tags = formattedTags;
      console.log("trip.tags, should be objects", trip.tags);
    }
    return trip;
  };

  // get trip info from firebase and set it to global TripBuilderFactory obj so it can be accessed in this controller and in TripBuilderCtrl
  TripFactory.getTripDetails($routeParams.tripId)
    .then(tripDetails => {
      tripDetails = convertTags(tripDetails);
      console.log('tripdetails', tripDetails);
      TripBuilderFactory.trip = tripDetails;
      $scope.trip = TripBuilderFactory;
    });
  });