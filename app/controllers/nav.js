'use strict';
angular.module("TravelBuddy").controller("NavCtrl", function ($scope, UserFactory) {

  $scope.login = () => {
    UserFactory.login()
    .then (() => {
      console.log("logged in!");
      // TODO: add username and picture
    });
  };

  $scope.logout = () => {
    UserFactory.logout()
    .then (() => {
      console.log("Logged out!");
    });
  };

  // check if user is logged in, hides and shows login/logout buttons accordingly

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.userIsLoggedIn = true;
    }
  });
 
});