'use strict';
angular.module("TravelBuddy").controller("NavCtrl", function ($scope, UserFactory) {

  $scope.login = () => {
    UserFactory.login()
    .then (() => {
      // TODO: add username and picture
      console.log("User logged in!");
    });
  };

  $scope.logout = () => {
    UserFactory.logout()
    .then (() => {
      console.log("User logged out!");
    });
  };
});