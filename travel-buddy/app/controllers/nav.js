'use strict';
angular.module("TravelBuddy").controller("NavCtrl", function ($scope, UserFactory) {

 
  $scope.switchUserState = () => {
    if(firebase.auth().currentUser === null){
      UserFactory.login()
      .then(({additionalUserInfo}) => {
        console.log("logged in!");
      });
    } else {
      UserFactory.logout()
      .then(()=> {
        console.log("logged out!");
      });
    }
  };

  // check if user is logged in, hides and shows login/logout buttons accordingly

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.buttonText = "Log Out";
      $scope.user = user.providerData[0];
    } else{
      $scope.buttonText = "Log In";
    }
  });
 
});