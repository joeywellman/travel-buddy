'use strict';
angular.module("TravelBuddy").controller("TripBuilderCtrl", function ($scope, TripFactory, GMapsFactory, GMapsCreds) {
  $scope.title = "Build A Trip";
  const tripLocations = [];

  const dummyData = [
    {
      formatted_address: "1455 Patton Ave, Asheville, NC 28806, USA",
      id: "ed52c408d87e9f3771cae64738b4229276b1be09",
      image: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAADNdJ3hrmot4WsTplzg6mKjZuq-6MsheYB_ocn3u-bcq0fitNv31ikPl53mOLDVFF1buevVGaOxN_xvBcmum07hZCVa6r8HnFyzNMfR-hwrXvayWdcwaeMaTcf-IKbacmEhAAFIgOlaaEfZMfc4MOTHmUGhSzojZEV8iqFSBFuX3M60ZczNsgog&key=AIzaSyBray2LUSZF_iOrl73bRjMwjjg3PgyRcWs",
      name: "Rocky's Hot Chicken Shack",
      place_id: "ChIJd3tqFF6MWYgR3a-3fnSA9oA"
    },
    {
      formatted_address: "444 Haywood Rd #101, Asheville, NC 28806, USA",
      id: "8d18c3b4108555bbd688fae7a1bc821b9b7174cf",
      image: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAArkD32B8ww8x_JAi8C-WNVOKnQdl5xTa-DG7XZovBOSMZ8uOzJ6uN6xD6edz8U-mRpdaKPhiihhdwe_VpYeo5WwRH_fG0oTT0qqhJYbRS6uH8ba2OaFg4yYEDorQh_BhLEhBOZuy_P0_N5HRQHqVFO_ueGhQcazGLaHMABVWBXicnpDfEC2Ro-w&key=AIzaSyBray2LUSZF_iOrl73bRjMwjjg3PgyRcWs",
      name: "King Daddy's Chicken and Waffle",
      place_id: "ChIJjbj_ecCMWYgRUwTcKnb7vPs"
    },
    {
      formatted_address: "99 Merrimon Ave, Asheville, NC 28801, USA",
      id: "126aaef107ed612fc326aafb1025bfe323cbbf2a",
      image: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAy8GwUdIHSdQNnV-JYF3mol66uCzCkaKjrjs08hwfaDjz20TKHVajpNIT0vN9mCQS6xXczt5SDrlZWBOFU0FgyPjM_S8JZtvsGZhEoJ5Bc-_Fefn-AKwpclsbKLUFswPGEhBrqsy0oFR6LdGPHG58zwNSGhQ8jOcV2VXi7HN5f43Rk6WKKjhMiQ&key=AIzaSyBray2LUSZF_iOrl73bRjMwjjg3PgyRcWs",
      name: "Bojangles' Famous Chicken 'n Biscuits",
      place_id: "ChIJ54OYxaj0WYgRDXJvmRap_JE"
    }
  ];


  $scope.searchPlaces = () => {

    $scope.places = dummyData;
    // GMapsFactory.placesSearch($scope.searchString)
    // .then((places) => {
    //   places.map((place) => {
    //     if (place.photos[0].photo_reference !== null){
    //       let imageKey = place.photos[0].photo_reference;
    //       place.image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageKey}&key=${GMapsCreds.apiKey}`;
    //     }
    //   });
    //   console.log("this should have an image key attached", places);
    //   $scope.places = places;
    // });
  };

  $scope.addToTrip = (place) => {
    tripLocations.push(place);
    // TODO: add buttons to reorder trip
    $scope.tripLocations = tripLocations;
  };
  
  const savePlaceObjects = () => {
    tripLocations.forEach ((location) => {
      let place = {
        description: location.description,
        id: location.place_id
      };
      TripFactory.postPlace(place);
    });
  };

  const buildTripObject = () => {
    // $scope.trip.uid = firebase.auth().currentUser.uid;
    const tripIds = tripLocations.map(location => {
      location = location.place_id;
      return location;
    });
    $scope.trip.locations = tripIds; // right now this is google place ids, could it be firebase ids at some point? should it be?
    $scope.trip.uid = 1234;
    return $scope.trip;
  };


  $scope.saveTrip = () => {
    savePlaceObjects();
    let trip = buildTripObject();
    trip.private = true;
    TripFactory.postTrip(trip)
    .then(data => {
      console.log("the places were posted");
    });
  };

  $scope.publishTrip = () => {
    savePlaceObjects();
    let trip = buildTripObject();
    trip.private = false;
    TripFactory.postTrip(trip)
    .then(data => {
      console.log("the trip was posted!");
    });
  };




  //empty trip object on scope bound to input
  // name
  // description
  // location
  // tags
  // place array
  // uid

  // empty place object on scope
  // gmaps id
  // description

  // on click --> tripFactory.addTrip
    // save button: trip.public = false
    // publish button = trip.public = true
  // add PLACE OBJECT for every object in the trip's place array every time you post a trip
});