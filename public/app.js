var britishCities = [];
var cityId;
var cityCoord;
var weatherMap;

var cityInfo = function() {
  var value = this.value;
  britishCities.forEach(function(city) {
    if (city.name === value) {
      cityId = city.id;
      cityCoord = city.coord;
    }
  });

  console.log(cityId);
  makeRequest(cityId, requestComplete);
}

var makeRequest = function(cityId, callback) {
  var request = new XMLHttpRequest();
  var url = "http://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&APPID=e3d60542d3e160281fa804a9fe92c67c";

  request.addEventListener("load", callback);
  console.log(url);
  request.open("GET", url);
  request.send();
}

var requestComplete = function() {
  if (this.status !== 200) return;

  var jsonString = this.responseText;
  var cityWeather = JSON.parse(jsonString);

  saveCity(cityWeather);
  populateList(cityWeather);
}

var saveCity = function(city) {
  var jsonString = JSON.stringify(city);
  localStorage.setItem("lastCity", jsonString);
}


var populateList = function(city) {
  weatherMap.googleMap.setCenter(cityCoords(city));
  weatherMap.addMarker(cityCoords(city));

  var bodyTag = document.querySelector("body");
  resetUl(bodyTag);

  var h2 = document.createElement("h2");
  h2.innerText = "Weather for " + city.city.name;
  bodyTag.appendChild(h2);

  populateHelper("Current weather", 0, city);

  populateHelper("24 hour forecast", 8, city);

  populateHelper("48 hour forecast", 16, city);
}

var populateHelper = function(string, index, city) {
  var h3 = document.createElement("h3");
  h3.classList.add("forecast-heading")
  h3.innerText = string;
  var ul = document.createElement("ul");
  ul.classList.add("weather-list");
   
  var liTemp = createTempLi(index, city);
  var liWeather = createWeatherLi(index, city);
  
  ul.appendChild(liTemp);
  ul.appendChild(liWeather);

  var bodyTag = document.querySelector("body");
  bodyTag.appendChild(h3);
  bodyTag.appendChild(ul);
}

var resetUl = function(bodyTag) {
  var allUlItems = document.querySelectorAll(".weather-list");
  allUlItems.forEach(function(ulItem) {
    bodyTag.removeChild(ulItem);
  });
  var allH3Items = document.querySelectorAll(".forecast-heading");
  allH3Items.forEach(function(h3Item) {
    bodyTag.removeChild(h3Item);
  });
}

var createTempLi = function(index, city) {
  var li = document.createElement('li');
  li.classList.add("list-item");
  li.innerText = "Temperature: "+Math.round((city.list[index].main.temp - 273.15))+"°C";
  return li;
}

var createWeatherLi = function(index, city) {
  var li = document.createElement("li");
  li.classList.add("list-item");
  li.innerText = "Weather: "+city.list[index].weather[0].description;
  return li;
}


var renderCity = function(select, city) {
  setTimeout(function() {
    var option = document.createElement("option");
    option.innerText = city.name;
    select.appendChild(option);      
  }, 0)
}


var cityCoords = function(city) {
  var latLng = {
    lat: city.city.coord.lat,
    lng: city.city.coord.lon
  }
  return latLng;
}


var app = function() {
  var center = {lat: 51.5074, lng: -0.13};
  var mapDiv = document.querySelector("#weather-map");
  weatherMap = new MapWrapper(mapDiv, center, 10);
  

  var citiesSelect = document.createElement("select");
  var body = document.querySelector("body");

  for(var city of cities) {
    if (city.country === "GB") {
      britishCities.push(city);
      renderCity(citiesSelect, city);
    }
  }

  setTimeout(function() {
    body.appendChild(citiesSelect);
  }, 0);

  setTimeout(function() {
    var jsonString = localStorage.getItem("lastCity");
    var lastCity = JSON.parse(jsonString) || [];
    if (lastCity.length !== 0) {
      savedCity = lastCity;
      populateList(lastCity);
    }
  }, 0);

  citiesSelect.addEventListener("change", cityInfo);
}


window.addEventListener("load", app);