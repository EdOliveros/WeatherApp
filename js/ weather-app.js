// API CLima
fetch('https://api.openweathermap.org/data/2.5/weather?lat=4.61&lon=-74.08&appid=6feea6f3fac0889a380448c28f699944&units=metric')
    .then(res => res.json())
    .then(response => console.log(response))


// API Lugares
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}


function getcity(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q= ${city} &limit=5&appid=6feea6f3fac0889a380448c28f699944`)
        .then(res => res.json())
        .then(response => console.log(response[0].lat))
}
 