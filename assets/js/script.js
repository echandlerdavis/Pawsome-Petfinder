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
var searchButtonEl = document.querySelector("#search-button");
var map;

function initMap() {
  var autocomplete = new google.maps.places.Autocomplete(cityInput, {
    componentRestrictions: { country: "us" },
    types: ["(cities)"],
    fields: ["place_id", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    console.log(
      place.name,
      place.geometry.location.lat(),
      place.geometry.location.lng(),
      place.place_id
    );
    locationCity = place.name;
    locationLat = place.geometry.location.lat();
    locationLng = place.geometry.location.lng();
  });

  map = new google.maps.Map(document.querySelector("#map"), {
    center: {
      lat: 37.0902,
      lng: -95.7129,
    },
    zoom: 4,
  });
}

function centerMap() {
  map = new google.maps.Map(document.querySelector("#map"), {
    center: {
      lat: locationLat,
      lng: locationLng,
    },
    zoom: 10,
  });
}

// clear results button (petfinder api only gives one token when the page loads, preventing multiple searches)
clearSearch.addEventListener("click", clear);
function clear() {
  location.reload();
}
searchButtonEl.addEventListener("click", search);

// search function
var token;
function search(event) {
  event.preventDefault();
  var key = "yZJnxnm7MRDykndmWxlpmmsUeSOcn0MwkYF7nE1CpCVnBmztQF";
  var secret = "OQtdFz7vReUXiWwtSWmhpe3nSt1gdXfF1P4Q0lM7";
  var searchList = document.getElementById("list-head");
  searchList.removeAttribute("class", "hide");

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

      // city input removes USA from Google Places auto complete; PetFinder API doesn't return results
      fetch(
        `https://api.petfinder.com/v2/organizations?&location=${cityInput.value.replace(
          ", USA",
          ""
        )}&sort=distance`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          orgList(data);
        })
        .catch((err) => console.error(err));
    });

  // center map
  centerMap();
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
        <li class="distance">${
          data.organizations[i].distance.toFixed(1) + " mi"
        }</li>
        <li class="name">
          <a class="" href="${data.organizations[i].url}">${
        data.organizations[i].name
      }</a>
        </li>
        <li class="address">${data.organizations[i].address.city}, ${
        data.organizations[i].address.state
      } ${data.organizations[i].address.postcode}</li>
      </ul>`;
  }
  shelterList.innerHTML = listing;
  // cityInput.value = "";
}

window.initMap = initMap
