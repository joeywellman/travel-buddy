'use strict';

angular.module("TravelBuddy").factory("TripFactory", (FBUrl, $http, $q) => {

  // HELPER FUNCTIONS
  function addKeys(dataObject){
    // adds firebase keys to firebase data
  }

  function convertToArray(dataObject){
    // converts firebase data to array
  } 


  //EXPORTED FUNCTIONS
  function getAllTrips() {
  // promises all PUBLIC trips
  // adds keys
  // converts to array
  // resolves array with keys
  }

  function getTripDetails(tripId){
    //promises details of specified trip
    // resolves an object
  }

  function getPlaceDetails(placeId){
    // gets place details (gmaps id)
    // resolves a single place obj
  }

  function addTrip(tripObj){
    // posts trip object to firebase
  }

  function addPlace(placeObj){
    //posts place object to firebase
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

  

  return {getAllTrips, getTripDetails, getPlaceDetails, addTrip, addPlace, updateTrip, getMyTrips, addFavorite, getMyFavorites, getSingleTrip};

});