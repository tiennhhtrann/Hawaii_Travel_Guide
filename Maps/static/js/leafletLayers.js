// Store our API endpoint as queryUrl.
var parkingURL = "https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Parking_Facilities/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
var hotelURL = "https://geodata.hawaii.gov/arcgis/rest/services/BusinessEconomy/MapServer/2/query?outFields=*&where=1%3D1&f=geojson";
var trailsURL = "https://geodata.hawaii.gov/arcgis/rest/services/Terrestrial/MapServer/34/query?outFields=*&where=1%3D1&f=geojson"
layers = {}
d3.json(hotelURL).then(function (hotelData) {
  // Once we get a response, send the data.features object to the createFeatures function.
  layers.hotel = createHotels(hotelData.features);
  
  d3.json(parkingURL).then(function (parkingData) {
    // Once we get a response, send the data.features object to the createFeatures function.
    layers.parking = createParking(parkingData.features);
    d3.json(trailsURL).then(function (trailData){
      layers.trails = createTrails(trailData.features)
      createMap(layers)
    })
    
  });
});


function createParking(parkingData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.NAME}</h3><hr><p>${feature.properties.ADDRESS}, ${feature.properties.CITY_1}</p>`);
  }

  var parking_structures = L.geoJSON(parkingData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {fillColor : 'green', color:'green'});
    },
  });

  // Return our parking_structures layer 
  return(parking_structures)
}

function createHotels(hotelData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.name}</h3><hr><p>${feature.properties.address}`);
  }

  var hotels = L.geoJSON(hotelData, {
    onEachFeature: onEachFeature
  });

  return hotels;
}

function createTrails(trailData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.trailname}</h3><hr><p>Length: ${feature.properties.length_mi} miles`);
  }

  var trail = L.geoJSON(trailData, {
    onEachFeature: onEachFeature,
    style: {
      color: "purple"
    }
  });

  return trail
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
    hotels : layers.hotel,
    trails : layers.trails
  };
  // Create our map, giving it default layers
  var myMap = L.map("map", {
    center: [21.48, -157.9],
    zoom: 11.5,
    layers: [street, layers.parking, layers.hotel, layers.trails]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


