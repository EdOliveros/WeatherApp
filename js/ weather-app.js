function renderMapaInteractivo(lat, lon, zoom = 8) {
  const container = document.getElementById('maps-container');
  container.innerHTML = '<div id="themap" style="height: 500px; width: 100%; border: 1px solid gray;"></div>';
  
  setTimeout(() => {
    const map = L.map('themap').setView([lat, lon], zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    L.marker([lat, lon]).addTo(map)
      .bindPopup('Ciudad encontrada!')
      .openPopup();
    
    const cloudsLayer = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=6feea6f3fac0889a380448c28f699944', { opacity: 1 });
    const tempLayer = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=6feea6f3fac0889a380448c28f699944', { opacity: 1 });
    const precipLayer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=6feea6f3fac0889a380448c28f699944', { opacity: 1 });
    const pressureLayer = L.tileLayer('https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=6feea6f3fac0889a380448c28f699944', { opacity: 1 });
    const windLayer = L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=6feea6f3fac0889a380448c28f699944', { opacity: 1 });
    
    L.control.layers(null, {
      '☁️ Nubes': cloudsLayer,
      '🌡️ Temperatura': tempLayer,
      '🌧️ Precipitación': precipLayer,
      '📊 Presión': pressureLayer,
      '💨 Viento': windLayer
    }).addTo(map);
    
    cloudsLayer.addTo(map);
    
    map.invalidateSize();
  }, 100);
}

function capitalizarOracion(oracion) {
  return oracion
    .toLowerCase()  
    .split(' ')     
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' '); 
}

async function getCity(city) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=6feea6f3fac0889a380448c28f699944`);
  const data = await response.json();
  if (data[0]) {
    const lat = data[0].lat;
    const lon = data[0].lon;
    getWeather(lat, lon);
    renderMapaInteractivo(lat, lon, 10);  // Zoom ciudad
  }
}

function renderCiudad(ciudad, pais, temperatura, clima, feelsLike) {
    const location = document.getElementById('location-contenedor')
    
    location.innerHTML = `<h3 class="ciudad">${ciudad}, ${pais}</h3><p class="temperatura">${temperatura}°</p><p class="clima">${clima}</p><p>Feels like ${feelsLike}°</p>`;
}

searchInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        getCity(searchInput.value)
    } 
})

function getDetails(details) {
    
    const icon = document.getElementById('icons-container')

    icon.innerHTML = `
    
        <div class="card">
            <p class="box">${details.Description}<p>
            <div class="img-container">
                <img src="https://openweathermap.org/img/wn/${details.Icon}@2x.png" alt="" class="img">
                <div class="line"></div>
            </div>
        </div>
    
    `

    for (const [titulo, description] of Object.entries(details)) {
        const div = document.createElement('div')
        div.className = 'card';
        div.innerHTML = `
            <h3>${titulo}</h3>
            <p>${description}</p>
        `;

        icon.appendChild(div)
    }

}


async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6feea6f3fac0889a380448c28f699944&units=metric`)
    const data = await response.json()

    console.log(data)
    console.log("Pais: " + data.sys.country)
    console.log("Ciudad: " + data.name)
    console.log("Temperatura: " + data.main.temp)
    console.log("Sensacion Termica: " + data.main.feels_like)
    console.log("Description: " + data.weather[0].description)
    console.log("Main: " + data.weather[0].main)
    console.log("Icon Code: " + data.weather[0].icon)
    console.log("Couds: " + data.clouds.all)
    console.log("Visibility: " + data.visibility)
    console.log("Wind Speed: " + data.wind.speed)
    console.log("Wind Deg: " + data.wind.deg)
    console.log("GrndLevel:" + data.main.grnd_level)
    console.log("Humidity: " + data.main.humidity)
    console.log("Pressure: " + data.main.pressure)
    console.log("SeaLevel: " + data.main.sea_level)
    console.log("TemMax: " + data.main.temp_max)
    console.log("TempMin: " + data.main.temp_min)
    console.log("Time Zone: " + data.timezone)
    console.log("Visibility: " + data.visibility)

    const Description = capitalizarOracion(data.weather[0].description)

    const details = {
        Clouds: data.clouds.all,
        
        Temperatura: data.main.temp, 
        GrndLevel: data.main.grnd_level,
        Humidity: data.main.humidity,
        Pressure: data.main.pressure,
        SeaLevel: data.main.sea_level,
        TemMax: data.main.temp_max,
        TempMin: data.main.temp_min,
        SensacionTermica: data.main.feels_like, 
        
        Ciudad: data.name, 
        Pais: data.sys.country, 

        TimeZone: data.timezone,
        Visibility: data.visibility,

        // Weather
        Description: Description,
        Main: data.weather[0].main, 
        Icon: data.weather[0].icon, 

        WindSpeed: data.wind.speed,
        WindDeg: data.wind.deg
    }

    renderCiudad(data.name, data.sys.country, data.main.temp, data.weather[0].main, data.main.feels_like)
    getDetails(details)
}

getCity('Bogota')