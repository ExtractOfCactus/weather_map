var britishCities = [];
var cityId;
var cityCoord;
// var weatherMap;

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
  var mapDiv = document.querySelector("#weather-map");
  var weatherMap = new MapWrapper(mapDiv, cityCoords(city), 10);

  var ul = document.createElement("ul");
  ul.classList.add("weather-list");
  var bodyTag = document.querySelector("body");
  resetUl(bodyTag);
  
  var liTemp = createTempLi(city);
  var liWeather = createWeatherLi(city);
  
  ul.appendChild(liTemp);
  ul.appendChild(liWeather);
  bodyTag.appendChild(ul);
}

var resetUl = function(bodyTag) {
  var allUlItems = document.querySelectorAll(".weather-list");
  allUlItems.forEach(function(ulItem) {
    bodyTag.removeChild(ulItem);
  })
}

var createTempLi = function(city) {
  var li = document.createElement('li');
  li.classList.add("list-item");
  li.innerText = "Temperature: "+Math.round((city.list[0].main.temp - 273.15))+"°C";
  return li;
}

var createWeatherLi = function(city) {
  var li = document.createElement("li");
  li.classList.add("list-item");
  li.innerText = "Weather: "+city.list[0].weather[0].description;
  return li;
}



var renderCity = function(select, city) {
  
  // weatherMap.setCenter(cityCoords(city));
  
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
  // citiesSelect.addEventListener("change", changeMapLocation);
}


window.addEventListener("load", app);