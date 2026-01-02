   async function getCity(city) {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
        const data = await response.json()
        const lat = (data[0].lat)
        const lon = (data[0].lon)
        getWeather(lat, lon)
        latLonToTile(data[0].lat, data[0].lon, 2)
}

function latLonToTile(lat, lon, zoom) {

  const sinLat = Math.log(Math.tan((90 + lat) * Math.PI / 360) / 
             (1 / Math.cos(lat * Math.PI / 180)));
  const y = Math.floor(((2 ** zoom) * (0.5 - sinLat / (2 * Math.PI))) % (2 ** zoom));

  const x = Math.floor(((lon + 180) / 360) * (2 ** zoom));
  
  getMap(x, y, zoom)
}

async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6feea6f3fac0889a380448c28f699944&units=metric`)
    const data = await response.json()
    console.log(data)
    console.log("Pais: " + data.sys.country)
    console.log("Ciudad: " + data.name)
    console.log("Temperatura: " + data.main.temp)
    console.log("Sensacion Termica: " + data.main.feels_like)
    console.log("Clima: " + data.weather[0].description)

    const details = {Pais:data.sys.country, Ciudad:data.name, Temperatura:data.main.temp, SensacionTermica:data.main.feels_like, Clima:data.weather[0].description}

    renderCiudad(data.name, data.sys.country, data.main.temp, data.weather[0].description, data.main.feels_like)
    getIcons(data.weather[0].icon, data)
}

function renderCiudad(ciudad, pais, temperatura, clima, feelsLike) {
    const location = document.getElementById('location-contenedor')
    
    location.innerHTML = `<h3 class="ciudad">${ciudad}, ${pais}</h3><p class="temperatura">${temperatura}°</p><p class="clima">${clima}</p><p>Feels like ${feelsLike}°</p>`;
}

function getIcons(code, data) {
    const iconCode = code    // https://openweathermap.org/img/wn/02d@2x.png

    const location = document.getElementById('icons-container')

    location.innerHTML = `
        <div class="card">
            <div class="box"></div>
            <div class="img-container">
                <img src="https://openweathermap.org/img/wn/${code}@2x.png" alt="" class="img">
                <div class="line"></div>
            </div>
        </div>
    `; 
}

function getMap(x, y, z) {

    const location = document.getElementById('maps-container')

    location.innerHTML = `
        <div class="map-card">
            <p>Clouds</p>
            <img class="mapa" src="https://tile.openweathermap.org/map/clouds_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944"></img>
        </div>
        <div class="map-card">
            <p>Precipitation</p>
            <img class="mapa" src="https://tile.openweathermap.org/map/precipitation_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944"></img>
        </div>
        <div class="map-card">
            <p>Pressure</p>
            <img class="mapa" src="https://tile.openweathermap.org/map/pressure_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944"></img>
        </div>
        <div class="map-card">
            <p>Wind</p>
            <img class="mapa" src="https://tile.openweathermap.org/map/wind_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944"></img>
        </div>
        <div class="map-card">
            <p>Clouds</p>
            <img class="mapa" src="https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944"></img>
        </div>
    
        `; 

}

getCity('Bogota')

const searchInput = document.getElementById('searchInput')

searchInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        getCity(searchInput.value)
    }
})



// pruebas

// API GOOGLE MAPS: AIzaSyD8MwQLEvwshRlY75A8Zne97IV6-j3ADrA


async function getGoogleMaps() {
    const res = await fetch(`https://maps.googleapis.com/maps/api/js?key=AIzaSyD8MwQLEvwshRlY75A8Zne97IV6-j3ADrA`)
    const data = res.json()

    console.log(data)
    console.log(res)
}

getGoogleMaps()