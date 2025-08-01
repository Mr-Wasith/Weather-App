const API_KEY = "704bd5251017df351ddd36cabc695cff";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

// No particles needed
function createParticles() {
    // Particles disabled for clean sky look
}

// Weather icons mapping
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '🌥️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '🌨️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
    'dust': '🌪️',
    'sand': '🌪️',
    'ash': '🌋',
    'squall': '💨',
    'tornado': '🌪️'
};

// DOM elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Temperature conversion function
function kelvinToCelsiusFahrenheit(kelvin) {
    const celsius = kelvin - 273.15;
    const fahrenheit = celsius * (9/5) + 32;
    return { celsius, fahrenheit };
}

// Format time function
function formatTime(timestamp, timezoneOffset) {
    const utcTime = new Date(timestamp * 1000);
    const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
    return localTime.toUTCString().slice(-12, -4);
}

// Format current time
function formatCurrentTime(timezoneOffset) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (timezoneOffset * 1000));
    return localTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get weather icon
function getWeatherIcon(description) {
    return weatherIcons[description.toLowerCase()] || '🌤️';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 6000);
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Show loading
function showLoading() {
    loading.classList.add('show');
    searchBtn.disabled = true;
    searchBtn.textContent = 'Exploring...';
}

// Hide loading
function hideLoading() {
    loading.classList.remove('show');
    searchBtn.disabled = false;
    searchBtn.textContent = 'Explore Weather';
}

// Update weather display
function updateWeatherDisplay(data) {
    const cityName = `${data.name}, ${data.sys.country}`;
    const tempData = kelvinToCelsiusFahrenheit(data.main.temp);
    const feelsLikeData = kelvinToCelsiusFahrenheit(data.main.feels_like);
    
    // Update basic info
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('currentTime').textContent = formatCurrentTime(data.timezone);
    document.getElementById('tempMain').textContent = `${Math.round(tempData.celsius)}°C`;
    document.getElementById('tempFeels').textContent = `Feels like ${Math.round(feelsLikeData.celsius)}°C • ${Math.round(feelsLikeData.fahrenheit)}°F`;
    document.getElementById('weatherDesc').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').textContent = getWeatherIcon(data.weather[0].description);

    // Update details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A';
    document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
    document.getElementById('rain').textContent = data.rain ? `${data.rain['1h'] || 0} mm` : '0 mm';

    // Update sun times
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);

    // Show weather card
    weatherCard.classList.add('show');
}

// Fetch weather data
async function fetchWeather(city) {
    try {
        showLoading();
        hideError();
        
        const url = `${BASE_URL}appid=${API_KEY}&q=${encodeURIComponent(city)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        
        const data = await response.json();
        updateWeatherDisplay(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message);
        weatherCard.classList.remove('show');
    } finally {
        hideLoading();
    }
}

// Form submit handler
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Initialize app
window.addEventListener('load', () => {
    createParticles();
    cityInput.focus();
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.0001;
        const x = (e.clientX * speed);
        const y = (e.clientY * speed);
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});