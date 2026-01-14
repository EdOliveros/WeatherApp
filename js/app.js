const API_KEY = '6feea6f3fac0889a380448c28f699944'; // In production, this should be proxied
const BASE_URL = 'https://api.openweathermap.org';

// DOM Elements
const elements = {
  searchBtn: document.getElementById('searchBtn'),
  input: document.getElementById('searchInput'),
  cityName: document.getElementById('cityName'),
  countryCode: document.getElementById('countryCode'),
  tempValue: document.getElementById('tempValue'),
  weatherDesc: document.getElementById('weatherDesc'),
  feelsLike: document.getElementById('feelsLike'),
  mainIcon: document.getElementById('mainIcon'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('windSpeed'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  mapContainer: document.getElementById('map'),
  themeToggle: document.getElementById('themeToggle'),
  suggestions: document.getElementById('suggestions')
};

let map = null;
let currentBaseLayer = null;

// --- Map Functions ---
function initMap(lat, lon) {
  if (map) {
    map.remove(); // Clean up existing map instance
  }

  map = L.map('map').setView([lat, lon], 10);

  const isLight = document.body.classList.contains('light-mode');
  const tileUrl = isLight
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Base Layer
  currentBaseLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Weather Layers
  const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { opacity: 1 });
  const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { opacity: 1 });
  const precipLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { opacity: 1 });
  const pressureLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { opacity: 1 });
  const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`, { opacity: 1 });

  // Layer Control
  const overlays = {
    "☁️ Nubes": cloudsLayer,
    "🌡️ Temperatura": tempLayer,
    "🌧️ Precipitación": precipLayer,
    "📊 Presión": pressureLayer,
    "💨 Viento": windLayer
  };

  L.control.layers(null, overlays).addTo(map);

  // Add Clouds by default if dark mode, maybe optional in light mode
  cloudsLayer.addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup('Aquí está el clima!')
    .openPopup();
}

// --- Helper Functions ---
function capitalize(str) {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Autocomplete Functions ---
async function fetchCitySuggestions(query) {
  if (!query || query.length < 3) {
    elements.suggestions.style.display = 'none';
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    const data = await response.json();
    renderSuggestions(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}

function renderSuggestions(cities) {
  if (!cities.length) {
    elements.suggestions.style.display = 'none';
    return;
  }

  elements.suggestions.innerHTML = cities.map(city => {
    const locationName = `${city.name}${city.state ? `, ${city.state}` : ''}`;
    const safeName = locationName.replace(/'/g, "\\'");
    return `
            <div class="suggestion-item" onclick="selectCity('${safeName}')">
                <span>${locationName}</span>
                <span class="country-flag">${city.country}</span>
            </div>
        `;
  }).join('');

  elements.suggestions.style.display = 'block';
}

window.selectCity = (fullName) => {
  elements.input.value = fullName;
  elements.suggestions.style.display = 'none';
  fetchWeatherData(fullName);
};

// Map OpenWeather icons to Weather Icons (wi-*)
function getWeatherIconClass(iconCode, sunRise, sunSet) {
  // Basic mapping - can be expanded
  const codeMapping = {
    '01d': 'wi-day-sunny',
    '01n': 'wi-night-clear',
    '02d': 'wi-day-cloudy',
    '02n': 'wi-night-alt-cloudy',
    '03d': 'wi-cloud',
    '03n': 'wi-cloud',
    '04d': 'wi-cloudy',
    '04n': 'wi-cloudy',
    '09d': 'wi-showers',
    '09n': 'wi-showers',
    '10d': 'wi-day-rain',
    '10n': 'wi-night-alt-rain',
    '11d': 'wi-thunderstorm',
    '11n': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '13n': 'wi-snow',
    '50d': 'wi-fog',
    '50n': 'wi-fog'
  };
  return codeMapping[iconCode] || 'wi-na';
}

// --- API Functions ---
async function fetchWeatherData(city) {
  try {
    // 1. Get Coordinates
    const geoResponse = await fetch(`${BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      alert('Ciudad no encontrada');
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    // 2. Get Weather
    const weatherResponse = await fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
    const weatherData = await weatherResponse.json();

    updateUI(name, country, weatherData);

    // Pass current lat/lon to be used by theme toggle if needed, or just re-init
    // Store current location for theme toggle re-render
    window.currentLocation = { lat, lon };
    initMap(lat, lon);

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Hubo un error al obtener el clima. Por favor intenta de nuevo.');
  }
}

// --- UI Updates ---
function updateUI(city, country, data) {
  elements.cityName.textContent = city;
  elements.countryCode.textContent = country;

  // Main Display
  elements.tempValue.textContent = Math.round(data.main.temp);
  elements.weatherDesc.textContent = capitalize(data.weather[0].description);
  elements.feelsLike.textContent = Math.round(data.main.feels_like);

  // Icon
  const iconClass = getWeatherIconClass(data.weather[0].icon);
  elements.mainIcon.innerHTML = `<i class="wi ${iconClass}"></i>`;

  // Details
  elements.humidity.textContent = `${data.main.humidity}%`;
  elements.windSpeed.textContent = `${data.wind.speed} m/s`;
  elements.pressure.textContent = `${data.main.pressure} hPa`;
  elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

// --- Event Listeners ---
elements.searchBtn.addEventListener('click', () => {
  const city = elements.input.value.trim();
  if (city) fetchWeatherData(city);
});

elements.input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = elements.input.value.trim();
    if (city) fetchWeatherData(city);
    elements.suggestions.style.display = 'none';
  }
});

elements.input.addEventListener('input', debounce((e) => {
  fetchCitySuggestions(e.target.value.trim());
}, 500));

// Close suggestions on click outside
document.addEventListener('click', (e) => {
  if (!elements.input.contains(e.target) && !elements.suggestions.contains(e.target)) {
    elements.suggestions.style.display = 'none';
  }
});

// Theme Toggle
elements.themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const icon = elements.themeToggle.querySelector('i');

  if (document.body.classList.contains('light-mode')) {
    icon.classList.remove('wi-day-sunny');
    icon.classList.add('wi-moon-alt-waxing-crescent-3');
  } else {
    icon.classList.remove('wi-moon-alt-waxing-crescent-3');
    icon.classList.add('wi-day-sunny');
  }

  // Refresh map if location is set
  if (window.currentLocation) {
    initMap(window.currentLocation.lat, window.currentLocation.lon);
  }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData('Bogota');
});