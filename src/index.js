import "./styles.css";

import clearIcon from '../assets/clear.png';
import partlyCloudyIcon from '../assets/partly-cloudy.png';
import cloudyIcon from '../assets/cloudy.png';
import overcastIcon from '../assets/overcast.png';
import mistIcon from '../assets/cloudy.png';
import patchyRainIcon from '../assets/rain.png';
import rainIcon from '../assets/rain.png';
import heavyRainIcon from '../assets/heavy-rain.png';
import showersIcon from '../assets/thunderstorm.png';
import thunderstormIcon from '../assets/thunderstorm.png';
import snowIcon from '../assets/snowy.png';
import fogIcon from '../assets/overcast.png';



const locationInput = document.querySelector('input');
const searchButton = document.querySelector('button');
const API_KEY = 'AF7LE7W5S2JYR9V2D3B3XLASL';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';


const weatherIcons = {
    "Clear": clearIcon,
    "Partially cloudy": partlyCloudyIcon,
    "Cloudy": cloudyIcon,
    "Overcast": overcastIcon,
    "Mist": mistIcon,
    "Patchy rain possible": patchyRainIcon,
    "Rain": rainIcon,
    "Heavy rain": heavyRainIcon,
    "Showers": showersIcon,
    "Thunderstorm": thunderstormIcon,
    "Snow": snowIcon,
    "Fog": fogIcon,
    "Rain, Overcast": overcastIcon,
    "Rain, Partially cloudy": rainIcon,
    "Snow, Partially cloudy": snowIcon,
    "Snow, Overcast": snowIcon
};




// Function to fetch weather and update UI
async function getWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}${city}?unitGroup=metric&key=${API_KEY}&contentType=json`);
        if (!response.ok) throw new Error('Weather data not found');

        const data = await response.json();
        updateDOM(data); // Call function to update UI
        console.log(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError("City not found! Try again.");
    }
}

// Function to update the DOM with weather data
function updateDOM(data) {
    document.querySelector('.city-name').textContent = data.resolvedAddress;
    document.querySelector('.temperature').textContent = `${data.currentConditions.temp}°C `;
    document.querySelector('.feels-like').textContent = ` Feels like ${data.currentConditions.feelslike}°C`;
    document.querySelector('.weather-condition').textContent = `Condition: ${data.currentConditions.conditions}`;
    document.querySelector('.humidity').textContent = `${data.currentConditions.humidity}%`;
    document.querySelector('.wind-speed').textContent = `${data.currentConditions.windspeed} km/h`;
    document.querySelector('.uv-index').textContent = data.currentConditions.uvindex;
    document.querySelector('.pressure').textContent = `${data.currentConditions.pressure} hPa`;
    document.querySelector('.visibility').textContent = `${data.currentConditions.visibility} km`;
    document.querySelector('.rain-chance').textContent = `${data.currentConditions.precipprob}%`;
    document.querySelector('.sunrise').textContent = data.currentConditions.sunrise;
    document.querySelector('.sunset').textContent = data.currentConditions.sunset;

    updateForecast(data.days); // Call function to display 15-day forecast
}


function updateForecast(days) {
    const forecastContainer = document.querySelector('.forecast-scroll');
    forecastContainer.innerHTML = ""; // Clear previous data

    days.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        // Get the correct icon or use a default fallback (there is no default icon for now)
        const condition = day.conditions;
        const iconSrc = weatherIcons[condition] || "../assets/default.png";

        forecastCard.innerHTML = `
            <h3>${new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</h3>
            <img src="${iconSrc}" alt="${condition}" class="forecast-icon">
            <p>${condition}</p>
            <p><strong>${day.tempmax}°C</strong> / ${day.tempmin}°C</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}



// Function to display an error message
function showError(message) {
    document.querySelector('.city-name').textContent = message;
    document.querySelector('.temperature').textContent = '--°C';
    document.querySelector('.feels-like').textContent = '';
    document.querySelector('.weather-condition').textContent = '';
    document.querySelector('.humidity').textContent = '--%';
    document.querySelector('.wind-speed').textContent = '-- km/h';
    document.querySelector('.uv-index').textContent = '--';
    document.querySelector('.pressure').textContent = '-- hPa';
    document.querySelector('.visibility').textContent = '-- km';
    document.querySelector('.rain-chance').textContent = '--%';
    document.querySelector('.sunrise').textContent = '-- AM';
    document.querySelector('.sunset').textContent = '-- PM';
}


// Event listener for search button
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents page refresh

    const city = locationInput.value.trim(); // Trim spaces
    if (city === "") {
        showError("Please enter a city!");
        return;
    }

    getWeather(city);

    locationInput.value = "";
});


