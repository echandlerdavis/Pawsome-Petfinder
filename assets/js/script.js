// Search bar autocomplete
const cityInput = document.querySelector("#city-input");
var autocomplete;
var place;
var userlocation;
var locationCity;
var locationState;
var locationLat;
var locationLng;
var locationPost;

function initMap() {
  var autocomplete = new google.maps.places.Autocomplete(cityInput, {
    componentRestrictions: { country: "us" },
    types: ["locality"],
    fields: ["place_id", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    console.log(place.name, place.geometry.location, place.place_id);
    locationCity = place.name;
  });
}

//Search button

// fetch token on page load
var token;
var expiry;
function getToken(cb) {
  fetch(
    "proxy",
    "https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //     {
      //   "token_type": "Bearer",
      //   "expires_in": 3600,
      //   "access_token": "..."
      // }
      token = data.access_token;
      expiry = Date.now() + data.expires_in;
      console.log("---------------------------------------");
      console.log(data);
      cb();
    });
}
//curl -d "grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ" https://api.petfinder.com/v2/oauth2/token
function getOrg() {
  fetch(
    // "https://api.petfinder.com/v2/organizations/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}",
    "https://api.petfinder.com/v2/organizations?location=" + locationCity,
    {
      headers: {
        Authorization: "Bearer" + token,
      },
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
function apiRequest(cb) {
  if (token === undefined || Date.now() > expiry) {
    getToken(cb);
  } else {
    cb();
  }
}

getToken();
apiRequest(getOrg);
