// Search bar autocomplete
const cityInput = document.querySelector("#city-input");
var autocomplete;
var place;
var userlocation;
function initMap() {
  var autocomplete = new google.maps.places.Autocomplete(cityInput, {
    componentRestrictions: { country: "us" },
    types: ["locality"],
    fields: ["place_id", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    console.log(place.name, place.geometry.location, place.place_id);
  });
}

// //Search button

// // fetch token on page load
// function getToken() {
//   fetch(
//     "https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ"
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         //     {
//         //   "token_type": "Bearer",
//         //   "expires_in": 3600,
//         //   "access_token": "..."
//         // }
//         token = data.access_token;
//         epiry = Date.now() + data.expires_in;
//         cb()
//       })
//   );
// }
// //curl -d "grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ" https://api.petfinder.com/v2/oauth2/token
// function getOrg() {
//   fetch(
//     "https://api.petfinder.com/v2/{CATEGORY}/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}",
//     //https://api.petfinder.com/v2/organizations
//     {
//       headers: {
//         Authorization: "Bearer" + token,
//       },
//     }
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//     });
// }
//  function apiRequest(cb){
//    if(token === undefined || Date.now() > expiry){
//      getToken(cb);
//    }else{
//      cb();
//    }
//  }

//  getToken():
//  apiRequest(getOrg)
