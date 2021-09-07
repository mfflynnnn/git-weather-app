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

const globalDate = new Date();
const localTimeZoneOffSet = globalDate.getTimezoneOffset() * 60; //seconds from GMT

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
  tempUnits = "F";

  cityDisplay.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
  mainTempElement.innerHTML = mainTemp;
  mainEmojiElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainEmojiElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
  getLocalTime(response.data.coord);
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
function getForecast(coordinates) {
  let coordsApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unitFahr}`;
  axios.get(coordsApiUrl).then(displayWeatherForecast);
}

function displayWeatherForecast(response) {
  let forecast = response.data.daily;
  let weatherForecast = document.querySelector(".weather-forecast");
  let forecastHTML = `<div class="row weather-forecast">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 weekdays">
          <div class="day-of-week">${formatForecastDays(forecastDay.dt)}</div>
          <img class="weekday-icon"
            src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
          />
          <div class="forecast-temps">
            <span class="weekday-temp-max">${Math.round(
              forecastDay.temp.max
            )}°</span>
            <span class="weekday-temp-min">${Math.round(
              forecastDay.temp.min
            )}°</span>
          </div>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  weatherForecast.innerHTML = forecastHTML;
}

function formatForecastDays(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let day = date.getDay();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[day];
}

//DISPLAY THE CURRENT TIME
function getLocalTime(coordinates) {
  let coordsApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unitFahr}`;
  axios.get(coordsApiUrl).then(coordsToDate);
}

function coordsToDate(response) {
  let remoteOffset = response.data.timezone_offset;
  displayTime(remoteOffset);
}

function displayTime(remoteOffset) {
  let localDate = new Date();
  let offsetDifference = localTimeZoneOffSet + remoteOffset; //difference in the two times in seconds
  let remoteTime = localDate.setSeconds(
    localDate.getSeconds() + offsetDifference
  ); //add that many seconds to the data
  let remoteAdjustedDate = new Date(remoteTime);
  let options = { weekday: "long" };
  let dayName = new Intl.DateTimeFormat("en-US", options).format(
    remoteAdjustedDate
  );
  let hours = remoteAdjustedDate.getHours();
  let amOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  let minutes = remoteAdjustedDate.getMinutes();

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
