'use strict';
angular.module("TravelBuddy").controller("InitTripCtrl", function ($scope, TripBuilderFactory) {
  $scope.title = "Let's get started";
  $scope.route = "#!/buildtrip/search";
  $scope.trip = TripBuilderFactory;
});