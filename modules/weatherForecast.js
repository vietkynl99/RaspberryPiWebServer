const axios = require('axios');

// Declare AccuWeather API URL to get weather information
const WEATHER_API_URL = 'http://dataservice.accuweather.com/forecasts/v1/daily/1day/';

// Declare the location key of the city you want to get weather information
const LOCATION_KEY = 353412 // Ha Noi

// Declare AccuWeather's API key
const API_KEY = 'tCZnyG34O6qUF12fvGrHTEcDGyhjf37A'

// URL
const URL = `${WEATHER_API_URL}${LOCATION_KEY}?apikey=${API_KEY}`

function getWeather(successCallback, errorCallback) {
    axios.get(URL)
        .then(response => {
            successCallback(response.data);
        })
        .catch(error => {
            errorCallback(error);
        });
}

module.exports = {
    getWeather
};