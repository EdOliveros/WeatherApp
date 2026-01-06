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

function getIcon(details) {
    const icon = document.getElementById('icon-container')
    
    icon.innerHTML = `    
    <div class="img-container">
        <img src="https://openweathermap.org/img/wn/${details.Icon.data}@2x.png" alt="" class="img">
    </div>
    `
}

function getDetails(details) {
    
    const icon = document.getElementById('details-container')

    Object.values(details).forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <p>${item.titulo}</p>
            <img src="${item.img}">
            <p>${item.data}</p>
        `;
        icon.appendChild(div);
    });

}


async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6feea6f3fac0889a380448c28f699944&units=metric`)
    const data = await response.json()

    const Description = capitalizarOracion(data.weather[0].description)

    const details = {

        Clouds: {
            titulo: "Nubes",
            data: data.clouds.all,
            img: "./img/Icons8/icons8-aguacero-100.png"
        },
        Temperatura: {
            titulo: "Temperatura",
            data: data.main.temp
        },
  GrndLevel: {
    titulo: "Nivel del suelo",
    data: data.main.grnd_level
  },
  Humidity: {
    titulo: "Humedad",
    data: data.main.humidity
  },
  Pressure: {
    titulo: "Presión",
    data: data.main.pressure
  },
  SeaLevel: {
    titulo: "Nivel del mar",
    data: data.main.sea_level
  },
  TemMax: {
    titulo: "Temperatura Máx",
    data: data.main.temp_max
  },
  TempMin: {
    titulo: "Temperatura Mín",
    data: data.main.temp_min
  },
  SensacionTermica: {
    titulo: "Sensación térmica",
    data: data.main.feels_like
  },
  Ciudad: {
    titulo: "Ciudad",
    data: data.name
  },
  Pais: {
    titulo: "País",
    data: data.sys.country
  },
  TimeZone: {
    titulo: "Zona horaria",
    data: data.timezone
  },
  Visibility: {
    titulo: "Visibilidad",
    data: data.visibility
  },
  Description: {
    titulo: "Descripción",
    data: Description
  },
  Main: {
    titulo: "Clima principal",
    data: data.weather[0].main
  },
  Icon: {
    titulo: "Ícono clima",
    data: data.weather[0].icon
  },
  WindSpeed: {
    titulo: "Velocidad viento",
    data: data.wind.speed
  },
  WindDeg: {
    titulo: "Dirección viento",
    data: data.wind.deg
  }
};

    console.log(details)

    renderCiudad(data.name, data.sys.country, data.main.temp, data.weather[0].main, data.main.feels_like)
    getDetails(details)
    getIcon(details)
}

getCity('Bogota')