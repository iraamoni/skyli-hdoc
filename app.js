const iconElement = document.querySelector('.weather-icon')
const notificationElement = document.querySelector('.notification')
const tempElement = document.querySelector('.temperature-value p')
const descElement = document.querySelector('.temperature-description p')
const locationElement = document.querySelector('.location p')

const weather = {}; 

weather.temperature = {
    unit: 'celsius'
}

const kelvin = 273; 
const key = '70e35fea7adc9d727c2aba9846756853';

//check if browser supports geolocation 

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

// Set users position 

function setPosition(position) {
    console.log(position)
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//show error when there is an issue with the geolocation service 

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function (data){
            weather.temperature.value = Math.floor(data.main.temp - kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

//display weather to UI
function displayWeather() {
    iconElement.innerHTML = `<img src= 'icons/${weather.iconId}.png'/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
}

// C to F conversion 

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener('click', function() {
    // if (weather.temperature.value === undefined) 
    // return;
    console.log(weather.temperature)
    if (weather.temperature.unit === 'celsius') {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`
        weather.temperature.unit = 'fahrenheit';
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = 'celsius'
    }
});
