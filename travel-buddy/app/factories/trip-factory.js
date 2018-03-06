'use strict';

angular.module("TravelBuddy").factory("TripFactory", (FBUrl, $http, $q) => {

  // // HELPER FUNCTION
  // converts to array and attaches firebase keys
  const convertToArray = dataObject => {
    const dataArray = [];
    let fbKeys = Object.keys(dataObject);
    fbKeys.forEach(key => {
      dataObject[key].id = key;
      dataArray.push(dataObject[key]);
    });
    return dataArray;
  };

  // destructures place data from firebase and adds property of place_id
  const formatPlaceIds = fbPlaceData => {
    let formattedData = fbPlaceData.map(place => {
      place = place.data;
      place.place_id = place.id;
      return place;
    });
    return formattedData;
  };



  //EXPORTED FUNCTIONS

  // promises all PUBLIC trips, adds keys, converts to array
  const getAllTrips = () => {
    return $q((resolve, reject) => {
      $http
        .get(`${FBUrl}/trips.json`)
        .then(({ data }) => {
          let tripArray = convertToArray(data);
          resolve(tripArray);
        });
    });
  };


  //promises details of specified trip, resolves an object
  const getTripDetails = tripId => {
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
  };


  // accepts an array of firebase ids that match up to places
  const getFirebasePlaces = placeArray => {
    const promises = [];
    placeArray.forEach(place => {
      let promise = $http.get(`${FBUrl}/places/${place}.json`);
      promises.push(promise);
    });
    return $q.all(promises);
  };

  // posts trip object to firebase
  const postTrip = tripObj => {
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
  };

  //accepts array of place objects, returns an array of promises to post each one to firebase
  const postPlaces = placeObjects => {
    const promises = [];
    placeObjects.forEach(place => {
      let promise = $http.post(`${FBUrl}/places.json`, JSON.stringify(place));
      promises.push(promise);
    });
    return $q.all(promises);
  };


  // edits trip
  const updateTrip = (tripObj, tripId) => {
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
  };


  // posts favorite object to firebase
  const addFavorite = faveObj => {
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
  };

  // promises user's favorites
  // resolves an array of favorite objects
  const getMyFavorites = uid => {
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
  };

  // deletes favorite object from firebase
  const deleteFave = faveId => {
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
  };

  // deletes trip from firebase
  const deleteTrip = tripId => {
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
  };




  return { getAllTrips, getTripDetails, getMyFavorites, getFirebasePlaces, postTrip, postPlaces, updateTrip, addFavorite, deleteTrip, deleteFave, formatPlaceIds };

});