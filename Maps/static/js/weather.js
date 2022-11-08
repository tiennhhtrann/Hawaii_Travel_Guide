weather_url = "http://127.0.0.1:5000/api/v1.0/weather-hawaii"


d3.json(weather_url).then(function(data) {
// temperature
  data.sort(function(a, b){
    return a.temperature - b.temperature;
  });
  bottom_10_temp = data.slice(0,10)
  makePlot("temp_plot", bottom_10_temp, "temperature", "Top 10 Coldest Cities in Hawaii")

  // wind speed
  data.sort(function(a, b){
    return b.wind_speed - a.wind_speed;
  });
  top_10_windspd = data.slice(0,10)
  makePlot("wind_plot", top_10_windspd, "wind_speed", "Cities with the Strongest Wind")
  // cloudiness
  data.sort(function(a, b){
    return b.cloudiness - a.cloudiness;
  });
  top_10_cloudiness = data.slice(0,10)

  console.log(top_10_cloudiness)
  makePlot("cloud_plot", top_10_cloudiness, "cloudiness", "Cities with the highest cloudiness")


} )

function makePlot(plotID, dataset, key, title){
  let trace1 = {
    x: dataset.map(row => row.city_name),
    y: dataset.map(row => row[key]),
    type: 'bar'
  };
  
  let data = [trace1];
  
  let layout = {
    title: title
  }
  
  Plotly.newPlot(plotID, data, layout);
}

