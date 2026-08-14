const apiKey = '061790cc16f005270fa85fc269897903';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');

const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

async function fetchWeatherByCity(city) {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    getWeatherData(url);
}

async function fetchWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    getWeatherData(url);
}

async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError();
    }
}

function updateUI(data) {
    errorMessage.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherCondition.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Dynamic Background switching based on condition
    const mainCondition = data.weather[0].main;
    document.body.className = ''; 
    document.body.classList.add(mainCondition);
}

function showError() {
    weatherInfo.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchWeatherByCity(cityInput.value.trim());
});

cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherByCity(cityInput.value.trim());
    }
});

// Geolocation Challenge
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
            },
            () => {
                alert('Location access denied or unavailable.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});