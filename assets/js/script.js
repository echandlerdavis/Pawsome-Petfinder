// Search bar autocomplete
const cityInput = document.querySelector("#city-input");

function initMap() {
  var Autocomplete = new google.maps.places.Autocomplete(cityInput, {
    componentRestrictions: { country: "us" },
    types: ["locality"],
  });
}
