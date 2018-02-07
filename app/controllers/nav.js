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

  // check if user is logged in, hides and shows login/logout buttons accordingly

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.userIsLoggedIn = true;
    }
  });
 
});