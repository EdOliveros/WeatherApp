// API CLima
// fetch('https://api.openweathermap.org/data/2.5/weather?lat=4.61&lon=-74.08&appid=6feea6f3fac0889a380448c28f699944&units=metric')
//     .then(res => res.json())
//     .then(response => console.log(response))


// API Lugares
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}


// function getcity(city) {
    // fetch(`http://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
    //         .then(res => res.json())
    //         .then(response => console.log(response[0].lat))
    // }
    
async function getCity(city) {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
        const data = await response.json()
        const lat = (data[0].lat)
        const lon = (data[0].lon)
        getWeather(lat, lon)
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
    renderDetails(details)
}

function renderCiudad(ciudad, pais, temperatura, clima, feelsLike) {
    const location = document.getElementById('location-contenedor')
    
    location.innerHTML = `<h3 class="ciudad">${ciudad}, ${pais}</h3><p class="temperatura">${temperatura}°</p><p class="clima">${clima}</p><p>Feels like ${feelsLike}°</p>`;
}

function renderDetails(d) {
    const details = document.getElementById('informacion-contenedor')
    
    details.innerHTML = `
    
        <div>
            <p>${d.SensacionTermica} C°</p>
        </div>
        <div>
            <p>${d.Clima} C°</p>
        </div>
    
    `
}

getCity('Bogota')

const searchInput = document.getElementById('searchInput')

searchInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        getCity(searchInput.value)
    }
})