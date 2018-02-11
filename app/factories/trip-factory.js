'use strict';

angular.module("TravelBuddy").factory("TripFactory", (FBUrl, $http, $q) => {

  // // HELPER FUNCTION
  // converts to array and attaches firebase keys
  function formatData(dataObject){
    const dataArray = [];
    let fbKeys = Object.keys(dataObject);
    fbKeys.forEach(key => {
      dataObject[key].id = key;
      dataArray.push(dataObject[key]);
    });
    return dataArray;
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
          let tripArray = formatData(data);
          resolve(tripArray);
        });
    });
  }

  //promises details of specified trip
  // resolves an object
  function getTripDetails(tripId){
    return $q((resolve, reject) => {
      $http
        .get(`${FBUrl}/trips/${tripId}.json`)
        .then((trip) => {
          resolve(trip.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // gets place details (gmaps id)
    // resolves a single place obj
  function getPlaceDetails(placeId){
    return $q((resolve, reject) => {
      $http
        .get(`${FBUrl}/places.json?orderBy="id"&equalTo="${placeId}"`)
        .then(item => {
          resolve(item.data);
        })
        .catch(err => {
          reject(err);
        });
    });
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

  function updateTrip(tripObj, tripId){
    return $q((resolve, reject) => {
      $http
        .put(`${FBUrl}/trips/${tripId}.json`,
        JSON.stringify(tripObj)
        )
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

   // fetches all trips the user has created, both public and private
    // adds keys and converts to array
    //resolves array of user's trips with keys
  function getMyTrips(uid){
    return $q((resolve, reject) => {
      $http.get(`${FBUrl}/trips.json?orderBy="uid"&equalTo="${uid}"`)
        .then(({ data }) => {
          let tripArray = formatData(data);
          resolve(tripArray);
        });
      });
  }

  // posts favorite object to firebase
  function addFavorite(faveObj){
    return $q((resolve, reject) => {
      $http
        .post(`${FBUrl}/favorites.json`, JSON.stringify(faveObj))
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // promises user's favorites
    // resolves an array of favorite objects
  function getMyFavorites(uid){
    return $q((resolve, reject) => {
      $http.get(`${FBUrl}/favorites.json?orderBy="uid"&equalTo="${uid}"`)
        .then(({ data }) => {
          console.log(data);
          resolve(data);
        });
    });
  }

  // function getSingleTrip(tripId){
  //   // promises a single trip by id
  //   // adds firebase key
  //   // this will be used in a loop after the favorites return from getMyFavorites
  // }

  // deletes trip from firebase
  function deleteTrip(tripId){
    return $q((resolve, reject) => {
      $http
        .delete(`${FBUrl}/trips/${tripId}.json`)
        .then(() => {
          deleteFave(tripId);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function deleteFave(faveId){
    // deletes favorite object from firebase
    return $q((resolve, reject) => {
      $http
        .delete(`${FBUrl}/favorites/${faveId}.json`)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  

  return {getAllPublicTrips, getTripDetails, getPlaceDetails, postTrip, postPlace, updateTrip, getMyTrips, addFavorite, getMyFavorites, deleteTrip, deleteFave};

});