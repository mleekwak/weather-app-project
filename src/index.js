//Get date and time    add in: <h3 id="date-temp">Current Date</h3>
let today = document.querySelector("#date-temp");
let dateTime = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let actualDay = days[dateTime.getDay()];
let actualMonth = month[dateTime.getMonth()];
today.innerHTML = `${actualDay} - ${actualMonth} ${dateTime.getDate()}, ${dateTime.getFullYear()} at ${dateTime.getHours()}:${dateTime.getMinutes()}`;




//Search city and replace title; search from Weather API
let searchButton = document.querySelector("#submit-button");
searchButton.addEventListener("click", citySearch);

function citySearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search");
  let cityHeader = document.querySelector("#city-header");
  cityHeader.innerHTML = city.value.toUpperCase();

  let apiKey = "ca91599099eeb1c9f12671ff71efe720";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getTemp);
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey}&units=imperial`;
  axios.get(forecastUrl).then(getForecast);

  function getTemp(response) {


    let cel = document.querySelector("#celsius");
    let far = document.querySelector("#farenheit");
    let temp = document.querySelector("#actual-temp");

    temp.innerHTML = Math.round(response.data.main.temp) + "°F";
    cel.addEventListener("click", fConvert);
    far.addEventListener("click", cConvert);
    //f and c conversion
    //((1°C × 9/5) + 32 = 33.8°F
    //(1°F − 32) × 5/9 = -17.22°C
    function fConvert(event) {
      event.preventDefault();
      temp.innerHTML = `${Math.round((`${response.data.main.temp}` - 32) * (5 / 9))}°C`;
    feelsLike.innerHTML = `Feels like: ${Math.round((`${response.data.main.feels_like}`-32)*(5/9))}°C`;
    }
    function cConvert(event) {
      event.preventDefault();
      temp.innerHTML = `${Math.round(response.data.main.temp)}°F`;
      feelsLike.innerHTML = `Feels like: ${Math.round(response.data.main.feels_like)}°F`;
    }

    
    let windSpeed = document.querySelector("#windSpeed");
    windSpeed.innerHTML = `Wind Speed: ${response.data.wind.speed} miles/hour`;

    let weatherDescription = document.querySelector("#weatherDescription");
    weatherDescription.innerHTML = `${(response.data.weather[0].description.toUpperCase())}`;
    
    let feelsLike = document.querySelector("#feelsLike");
    feelsLike.innerHTML = `Feels like: ${Math.round(response.data.main.feels_like)}°F`;

    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;

    let mainIcon = document.querySelector("#mainIcon");
    mainIcon.setAttribute ("src",`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    }
}


//Geolocation
let currentButton = document.querySelector("#currentLocation-button");
currentButton.addEventListener("click", retrievePosition);

navigator.geolocation.getCurrentPosition(retrievePosition);

function retrievePosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(url).then(getTemp);

  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(forecastUrl).then(getForecast);
}



function formatHours (timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10 ) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;

  }

  return `${hours}:${minutes}`;
}



function getTemp(response) {
  console.log(response);
  let cel = document.querySelector("#celsius");
  let far = document.querySelector("#farenheit");
  let temp = document.querySelector("#actual-temp");
  let cityHeader = document.querySelector("#city-header");
  let feelsLike = document.querySelector("#feelsLike");

  cityHeader.innerHTML = `${response.data.name}`;
  temp.innerHTML = Math.round(response.data.main.temp) + "°F";
  cel.addEventListener("click", fConvert);
  far.addEventListener("click", cConvert);
  //f and c conversion
  //((1°C × 9/5) + 32 = 33.8°F
  //(1°F − 32) × 5/9 = -17.22°C

   function fConvert(event) {
      event.preventDefault();
      temp.innerHTML = `${Math.round((`${response.data.main.temp}` - 32) * (5 / 9))}°C`;
    feelsLike.innerHTML = `Feels like: ${Math.round((`${response.data.main.feels_like}`-32)*(5/9))}°C`;
    }
    function cConvert(event) {
      event.preventDefault();
      temp.innerHTML = `${Math.round(response.data.main.temp)}°F`;
      feelsLike.innerHTML = `Feels like: ${Math.round(response.data.main.feels_like)}°F`;
    }

    let windSpeed = document.querySelector("#windSpeed");
    windSpeed.innerHTML = `Wind Speed: ${response.data.wind.speed} miles/hour`;

    let weatherDescription = document.querySelector("#weatherDescription");
    weatherDescription.innerHTML = `${(response.data.weather[0].description.toUpperCase())}`;
    
   
    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;

   let mainIcon = document.querySelector("#mainIcon");
    mainIcon.setAttribute ("src",`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
}

//Forecast
function getForecast (response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null; 
  let forecast = null;

  for (let index=0; index < 6; index++) {
  forecast = response.data.list[index];
  forecastElement.innerHTML += 
        ` <div class="col-2">
            <p>${formatHours(forecast.dt*1000)}</p>
        
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"></img>
            <div class = "weather-temp"> 
              <strong> <div class = "forecastTempMax">${Math.round(forecast.main.temp_max)}°</div></strong> 
              <div class = "forecastTempMin"> ${Math.round(forecast.main.temp_min)}° </div>
            </div>
          </div>`
     
   }
}