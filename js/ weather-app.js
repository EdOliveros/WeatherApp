function latLonToTile(zoom, lat, lon) {
    const n = Math.pow(2, zoom);
    const latRad = lat * (Math.PI / 180);
    const x = Math.floor(n * ((lon + 180) / 360));
    const y = Math.floor(0.5 * n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)));
    renderMaps(x,y, zoom);
}

async function getCity(city) {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
        const data = await response.json()
        const lat = (data[0].lat)
        const lon = (data[0].lon)
        getWeather(lat, lon)
        latLonToTile(0, lat, lon)

}

function renderCiudad(ciudad, pais, temperatura, clima, feelsLike) {
    const location = document.getElementById('location-contenedor')
    
    location.innerHTML = `<h3 class="ciudad">${ciudad}, ${pais}</h3><p class="temperatura">${temperatura}°</p><p class="clima">${clima}</p><p>Feels like ${feelsLike}°</p>`;
}

function renderMaps(x, y, z) {
    const map = document.getElementById('maps-container')

    map.innerHTML = `
    
        <div class="map-container">
            <p class="map-title">Clouds<p>
            <img src="https://tile.openweathermap.org/map/clouds_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944" alt="" class="img">
        </div>
        <div class="map-container">
            <p class="map-title">Precipitation<p>
            <img src="https://tile.openweathermap.org/map/precipitation_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944" alt="" class="img">
        </div>
        <div class="map-container">
            <p class="map-title">Pressure<p>
            <img src="https://tile.openweathermap.org/map/pressure_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944" alt="" class="img">
        </div>
        <div class="map-container">
            <p class="map-title">Wind<p>
            <img src="https://tile.openweathermap.org/map/wind_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944" alt="" class="img">
        </div>
        <div class="map-container">
            <p class="map-title">Temp<p>
            <img src="https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=6feea6f3fac0889a380448c28f699944" alt="" class="img">
        </div>
    
    `
}

searchInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        getCity(searchInput.value)
    } 
})

function getDetails(details) {
    
    const icon = document.getElementById('icons-container')

    const iconCode = details.Icon
    const title = details.Clima
    
    icon.innerHTML = `
    
        <div class="card">
            <p class="box">${title}<p>
            <div class="img-container">
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="" class="img">
                <div class="line"></div>
            </div>
        </div>
    
    `
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

    const details = {
        Icon: data.weather[0].icon, 
        Pais: data.sys.country, 
        Ciudad: data.name, 
        Temperatura: data.main.temp, 
        SensacionTermica: data.main.feels_like, 
        Clima: data.weather[0].description,
        Clouds: data.clouds.all,
        GrndLevel: data.main.grnd_level,
        Humidity: data.main.humidity,
        Pressure: data.main.pressure,
        SeaLevel: data.main.sea_level,
        TemMax: data.main.temp_max,
        TempMin: data.main.temp_min,
    }

    renderCiudad(data.name, data.sys.country, data.main.temp, data.weather[0].main, data.main.feels_like)
    getDetails(details)
}

getCity('Bogota')