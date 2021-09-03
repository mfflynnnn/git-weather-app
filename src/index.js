//VARIABLES
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let cityDisplay = document.querySelector(".city-info");
let defaultCityName = "London";
let unitFahr = "imperial";
//let unitCel = "metric";
let apiKey = "bf73b51ef2be4a323ff1bb029d39992b";

//CREATE A URL AND PASS IT CITY DATA WHEN WE CALL IT
function createUrlFromNewCity(city) {
  return `${apiUrl}q=${city}&units=${unitFahr}&appid=${apiKey}`;
}

//ON FORM-SUBMIT, CHANGE THE NAME OF THE CITY TO THE CITY THE USER SEARCHED FOR
function changeCity(event) {
  event.preventDefault();
  let cityEntry = document.querySelector(".form-control");
  let cityName = cityEntry.value;
  cityDisplay.innerHTML = cityName;
  let newUrl = createUrlFromNewCity(cityName);
  axios.get(newUrl).then(updateCityData);
}

//ON FORM-SUBMIT (FROM changeCity), CHANGE THE TEMP AND WEATHER DESCRIPTION BASED ON THE CITY THE USER SEARCHED FOR
function updateCityData(response) {
  let weatherDescriptionElement = document.querySelector(
    ".weather-description"
  );
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  let mainTemp = Math.round(response.data.main.temp);
  let mainTempElement = document.querySelector(".main-temp");
  let mainEmojiElement = document.querySelector(".main-emoji");

  console.log(response.data);

  cityDisplay.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
  mainTempElement.innerHTML = `${mainTemp}°`;
  mainEmojiElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainEmojiElement.setAttribute("alt", response.data.weather[0].description);
}

//DISPLAY THE CURRENT TIME FOR SEATTLE - THIS DOES NOT YET HAVE TO CHANGE W/ CHANGE OF CITY
function displayTime() {
  let date = new Date();
  let options = { weekday: "long" };
  let dayName = new Intl.DateTimeFormat("en-US", options).format(date);
  let hours = date.getHours();
  let amOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let finalTime = hours + ":" + minutes + " " + amOrPm;
  let timeStamp = document.querySelector(".date-time");
  timeStamp.innerHTML = `${dayName} ${finalTime}`;
}

//CALL FUNCTIONS
window.addEventListener("submit", changeCity);
axios.get(createUrlFromNewCity(defaultCityName)).then(updateCityData);
displayTime();

/*
-----------------------------------------------------------------------------------------------------
//FUTURE CODE
//DISPLAY TEMPERATURE IN FAHRENHEIT
function tempFahrenheit(event) {
  event.preventDefault();
  let primaryTemp = document.querySelector(".main-temp");
  let celcius = 13;
  let convertToFahr = Math.round(celcius * (9 / 5) + 32);
  primaryTemp.innerHTML = convertToFahr;
}

let fahrLink = document.querySelector(".fahr");
fahrLink.addEventListener("click", tempFahrenheit);

function tempCelcius(event) {
  event.preventDefault();
  let primaryTemp = document.querySelector(".main-temp");
  let fahrenheit = 55;
  let convertToCel = Math.round((fahrenheit - 32) * (5 / 9));
  primaryTemp.innerHTML = convertToCel;
}

let celLink = document.querySelector(".cel");
celLink.addEventListener("click", tempCelcius);

function createUrlFromCoords(lat, long) {
  return `${apiUrl}lat=${lat}&lon=${long}&units=${unitFahr}&appid=${apiKey}`;
}

//ON BUTTON-CLICK, DISPLAY USER'S CURRENT WEATHER
function clickForLocalWeather(event) {
  event.preventDefault();
  let button = 
  let localCityLatitude = position.coords.latitude;
  let localCityLongitude = position.coords.longitude;
  let coordsUrl = createUrlFromCoords(localCityLatitude, localCityLongitude);
  axios.get(coordsUrl).then(updateCityData);
}

navigator.geolocation.getCurrentPosition(clickForLocalWeather);
window.addEventListener("click", clickForLocalWeather);
*/

/* 
------------------------------------------
TASK LIST
1). DONE - Include the search engine
2). DONE - Implement API integration
3). DONE - Factor in weather icon
4). DONE - Factor in wind speed, humidity, and weather description
5). Factor in unit conversion (c/f)

TIME DOESN'T MATTER
FORECAST DOESN'T MATTER
*/
