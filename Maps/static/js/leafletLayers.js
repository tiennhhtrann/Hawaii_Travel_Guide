// Store our API endpoint as queryUrl.
var parkingURL = "https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Parking_Facilities/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
var hotelURL = "https://geodata.hawaii.gov/arcgis/rest/services/BusinessEconomy/MapServer/2/query?outFields=*&where=1%3D1&f=geojson";

layers = {}
d3.json(hotelURL).then(function (hotelData) {
  // Once we get a response, send the data.features object to the createFeatures function.
  layers.hotel = createHotels(hotelData.features);
  
  d3.json(parkingURL).then(function (parkingData) {
    // Once we get a response, send the data.features object to the createFeatures function.
    layers.parking = createFeatures(parkingData.features);
    createMap(layers)
  });
});




function createFeatures(parkingData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.NAME}</h3><hr><p>${feature.properties.ADDRESS}, ${feature.properties.CITY_1}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the parkingData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var parking_structures = L.geoJSON(parkingData, {
    onEachFeature: onEachFeature
  });

  // Return our parking_structures layer 
  return(parking_structures)
}

function createHotels(hotelData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.name}</h3><hr><p>${feature.properties.address}`);
  }

  // Create a GeoJSON layer that contains the features array on the parkingData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var hotels = L.geoJSON(hotelData, {
    onEachFeature: onEachFeature
  });

  // Send our parking_structures layer to the createMap function/
  return hotels;
}



function createMap(layers) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    parking_structures: layers.parking,
    hotels : layers.hotel
  };
  // Create our map, giving it the streetmap and parking_structures layers to display on load.
  var myMap = L.map("map", {
    center: [21.48, -157.9],
    zoom: 11.5,
    layers: [street, layers.parking]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


