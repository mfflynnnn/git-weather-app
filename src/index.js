//VARIABLES
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let cityDisplay = document.querySelector(".city-info");
let defaultCityName = "London";
let unitFahr = "imperial";
let apiKey = "bf73b51ef2be4a323ff1bb029d39992b";
let fahrLink = document.querySelector(".fahr");
let celLink = document.querySelector(".cel");
let tempUnits = "F";
let mainTempElement = document.querySelector(".main-temp");

//CREATE A URL AND PASS IT CITY DATA WHEN WE CALL IT
function createUrlFromNewCityFahr(city) {
  return `${apiUrl}q=${city}&units=${unitFahr}&appid=${apiKey}`;
}

//ON FORM-SUBMIT, CHANGE THE NAME OF THE CITY TO THE CITY THE USER SEARCHED FOR
function changeCity(event) {
  event.preventDefault();
  let cityEntry = document.querySelector(".form-control");
  let cityName = cityEntry.value;
  cityDisplay.innerHTML = cityName;
  let newUrl = createUrlFromNewCityFahr(cityName);
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
  let mainEmojiElement = document.querySelector(".main-emoji");

  cityDisplay.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
  mainTempElement.innerHTML = mainTemp;
  mainEmojiElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainEmojiElement.setAttribute("alt", response.data.weather[0].description);
}

//ON CLICK, CHANGE THE MAIN TEMP BETWEEN FAHRENHEIT AND CELSIUS
function tempToFahrenheit(event) {
  event.preventDefault();
  //Get temp
  let tempString = mainTempElement.innerHTML;
  tempNumber = Number(tempString);
  if (tempUnits == "F") {
    return;
  }
  //Convert Cel to Fahr
  let celToFahr = Math.round((tempNumber * 9) / 5 + 32);

  tempUnits = "F";
  //Display
  mainTempElement.innerHTML = celToFahr;
}

function tempToCelsius(event) {
  event.preventDefault();
  //Get temp
  let tempString = mainTempElement.innerHTML;
  tempNumber = Number(tempString);
  if (tempUnits == "C") {
    return;
  }
  //Convert Fahr to Cel
  let fahrToCel = Math.round((tempNumber - 32) * (5 / 9));

  tempUnits = "C";
  //Display
  mainTempElement.innerHTML = fahrToCel;
}

//DISPLAY 5-DAY WEATHER FORECAST

function displayWeatherForecast(day) {
  let weatherForecast = document.querySelector(".weather-forecast");
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  let forecastHTML = `<div class="row weather-forecast">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2 weekdays">
        <div class="day-of-week">${day}</div>
        <div class="weekday-emoji">⛅</div>
        <div class="weekday-temp">65°F</div>
      </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  weatherForecast.innerHTML = forecastHTML;
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
axios.get(createUrlFromNewCityFahr(defaultCityName)).then(updateCityData);
window.addEventListener("submit", changeCity);
fahrLink.addEventListener("click", tempToFahrenheit);
celLink.addEventListener("click", tempToCelsius);
displayWeatherForecast();
displayTime();

/*
-----------------------------------------------------------------------------------------------------
//FUTURE CODE

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
1). 
*/
