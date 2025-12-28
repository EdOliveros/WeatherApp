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
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
        const data = await response.json()
        const lat = (data[0].lat)
        const lon = (data[0].lon)
        getWeather(lat, lon)
}

async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6feea6f3fac0889a380448c28f699944&units=metric`)
    const data = await response.json()
    console.log(data)
}