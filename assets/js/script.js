// Search bar autocomplete
const cityInput = document.querySelector("#city-input");
const clearSearch = document.querySelector("#clear-search");
var autocomplete;
var place;
var userlocation;
var locationCity;
var locationState;
var locationLat;
var locationLng;
var locationPost;
var searchButtonEl = document.querySelector('#search-button');
function initMap() {
  var autocomplete = new google.maps.places.Autocomplete(cityInput, {
    componentRestrictions: { country: "us" },
    types: ["(cities)"],
    fields: ["place_id", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    console.log(place.name, place.geometry.location, place.place_id);
    locationCity = place.name;
  });
}

// clear results button (petfinder api only gives one token when the page loads, preventing multiple searches) 
clearSearch.addEventListener("click", clear)
function clear() {
  location.reload();
}
searchButtonEl.addEventListener("click", search);

// search function 
function search(event) {
  event.preventDefault();
  var key = "yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF";
  var secret = "OQtdFz7vReUXiWwtSWmhpe3nSt1gdXfF1P4Q0lM7";
  var token;

  // get authorization token
  fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      key +
      "&client_secret=" +
      secret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      token = data.access_token;
    })
    .then(() => {
      // use token to fetch organizations
      console.log(token)
      // city input removes USA from Google Places auto complete; PetFinder API doesn't return results
      fetch(`https://api.petfinder.com/v2/organizations?&location=${cityInput.value.replace(", USA", "")}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          orgList(data);
        })
        .catch((err) => console.error(err));
    });
}
const shelterTitle1 = document.querySelector("#shelterQuantity1");
const shelterTitle2 = document.querySelector("#shelterQuantity2");
const shelterList = document.querySelector("#shelter-listings");
var listing = "";

function orgList(data) {
  console.log(data);
  shelterTitle1.textContent = data.organizations.length;
  shelterTitle2.textContent = data.organizations.length;
  shelterList.innerHTML = "";
  for (var i = 0; i < data.organizations.length; i++) {
    listing =
      listing +
      `<ul>
        <li class="distance">${data.organizations[i].distance.toFixed(1) + " mi"}</li>
        <li class="name">
          <a class="" href="${data.organizations[i].url}">${data.organizations[i].name
      }</a>
        </li>
        <li class="address">${data.organizations[i].address.city}, ${data.organizations[i].address.state
      } ${data.organizations[i].address.postcode}</li>
      </ul>`;
  }
  shelterList.innerHTML = listing;
  console.log(listing);
  // cityInput.value = "";
}

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBfdOo81NF8nSCKTzVEZrucPVkMT8IJHoQ&libraries=places">
let map;
let service;
let infowindow;

function initMapTwo() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}
initMapTwo();


// enable search text field and submit button to retrieve orgainaization listings 
// add function to organize listings in order with closest in distance first
// clean up code 
// Integrate google map to find places nearby in Google Maps using Google Places API



// // fetch token on page load
// var token;
// var expiry;
// function getToken(cb) {
//   fetch(
//     "https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ"
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       //     {
//       //   "token_type": "Bearer",
//       //   "expires_in": 3600,
//       //   "access_token": "..."
//       // }
//       token = data.access_token;
//       expiry = Date.now() + data.expires_in;
//       console.log("---------------------------------------");
//       console.log(data);
//       cb();
//     });
// }
// //curl -d "grant_type=client_credentials&client_id=yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF&client_secret=3knFu1WvX735C8SFKEC3gwbvGKkMuCoR6w0wcUoQ" https://api.petfinder.com/v2/oauth2/token
// function getOrg() {
//   fetch(
//     // "https://api.petfinder.com/v2/organizations/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}",
//     "https://api.petfinder.com/v2/organizations?location=" + locationCity,
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
// function apiRequest(cb) {
//   if (token === undefined || Date.now() > expiry) {
//     getToken(cb);
//   } else {
//     cb();
//   }
// }

// getToken();
// apiRequest(getOrg);