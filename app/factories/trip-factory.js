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
  function getAllTrips() {
    return $q((resolve, reject) => {
      $http
        .get(`${FBUrl}/trips.json`)
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

  function getFavoriteDetails(faveArray) {
    const promises = [];
    faveArray.forEach(trip => {
      let promise = $http.get(`${FBUrl}/trips/${trip.id}.json`);
      promises.push(promise);
    });
    return $q.all(promises);
  }


  // accepts an array of firebase ids that match up to places
  function getFirebasePlaces(placeArray){
    const promises = [];
    placeArray.forEach(place => {
      let promise = $http.get(`${FBUrl}/places/${place}.json`);
      promises.push(promise);
    });
    return $q.all(promises);
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

  //accepts array of place objects, returns an array of promises to post each one to firebase
  function postPlaces(placeObjects){
    const promises = [];
    placeObjects.forEach(place => {
      let promise = $http.post(`${FBUrl}/places.json`, JSON.stringify(place));
      promises.push(promise);
    });
    return $q.all(promises);
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
          let keys = Object.keys(data);
          let faveArray = [];
          keys.forEach(key => {
            data[key].fbId = key;
            faveArray.push(data[key]);
          });
          resolve(faveArray);
        });
    });
  }

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
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }



  return {getAllTrips, getFavoriteDetails, getTripDetails, getFirebasePlaces, postTrip, postPlaces, updateTrip, getMyTrips, addFavorite, getMyFavorites, deleteTrip, deleteFave};

});