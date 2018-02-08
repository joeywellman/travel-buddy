'use strict';

angular.module("TravelBuddy").factory("TripFactory", (FBUrl, $http, $q) => {

  // // HELPER FUNCTIONS
  // function addKeys(dataObject){
  //   // adds firebase keys to firebase data
  // }

  // converts to array and attaches firebase keys
  function formatData(dataObject){
    Object.keys(dataObject).map(key => {
      dataObject[key].id = key;
      return dataObject[key];
    });
    return dataObject;
  } 


  //EXPORTED FUNCTIONS

   // promises all PUBLIC trips
  // adds keys
  // converts to array
  // resolves array with keys
  function getAllPublicTrips() {
    return $q((resolve, reject) => {
      $http
        .get(`${FBUrl}/trips.json?orderBy="private"&equalTo=false`)
        .then(({ data }) => {
          console.log("trips", data);
          let tripArray = formatData(data);
          console.log("this should be an array with firebase keys attached", tripArray);
          resolve(tripArray);
        });
    });
  }

  function getTripDetails(tripId){
    //promises details of specified trip
    // resolves an object
  }

  function getPlaceDetails(placeId){
    // gets place details (gmaps id)
    // resolves a single place obj
  }

  // posts trip object to firebase
  function postTrip(tripObj){
    return $q((resolve, reject) => {
      $http
        .post(`${FBUrl}/trips.json`, JSON.stringify(tripObj))
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.log(error); 
          reject(error);
        });
    });
  }

  //posts place object to firebase
  function postPlace(placeObj){
    return $q((resolve, reject) => {
      $http
        .post(`${FBUrl}/places.json`, JSON.stringify(placeObj))
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  function updateTrip(tripObj){
    // puts tripObj to firebase
  }

  function getMyTrips(uid){
    // fetches all trips the user has created, both public and private
    // adds keys and converts to array
    //resolves array of user's trips with keys
  }

  function addFavorite(obj){
    // posts favorite object to firebase
  }

  function getMyFavorites(uid){
    // promises user's favorites
    // resolves an array of favorite objects
  }

  function getSingleTrip(tripId){
    // promises a single trip by id
    // adds firebase key
    // this will be used in a loop after the favorites return from getMyFavorites
  }

  function deleteTrip(tripId){
    // deletes trip from firebase
  }

  function deleteFave(faveId){
    // deletes favorite object from firebase
  }

  

  return {getAllPublicTrips, getTripDetails, getPlaceDetails, postTrip, postPlace, updateTrip, getMyTrips, addFavorite, getMyFavorites, getSingleTrip};

});