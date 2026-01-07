# 🌤️ Weather App

An interactive web application that displays the current weather and forecast for any city in the world 🌎.  
It uses real-time weather data and integrates dynamic maps to visualize the selected location.

[🔗 **View the live app here**](https://edoliveros.github.io/WeatherApp/)  

---

## 🧭 Overview

Weather App allows you to search for the weather of any city by typing its name in the search bar.  
The app displays:
- The exact location on a dynamic map.  
- The current weather with icons and detailed information such as temperature, humidity, wind speed, and more.  
- A visual summary of the weather conditions.  

All presented with a clean and responsive design, perfect for both desktop and mobile devices.

---

## 💻 Technologies Used

| Type | Tools / Libraries |
|------|--------------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Frameworks / Libraries** | - [Leaflet.js](https://leafletjs.com/) for interactive maps |
| **Fonts** | [Google Fonts](https://fonts.google.com/) (Google Sans & Quicksand) |
| **Icons** | [Weather Icons](https://erikflowers.github.io/weather-icons/) for weather visualization |
| **APIs** | - [OpenWeatherMap API](https://openweathermap.org/api) (weather data)<br> - [OpenStreetMap](https://www.openstreetmap.org/) (map tiles) |

---

## ⚙️ How It Works

1. The user enters the name of a **city** in the search bar.
2. The script (`weather-app.js`):
   - Captures the input value and calls the **OpenWeatherMap API** to request current weather data.
   - Processes the response in JSON format.
   - Displays temperature, humidity, description, icon, and wind information in the main container.
3. At the same time, **Leaflet.js** is used to display the location on an interactive map.
4. All content is dynamically rendered within the DOM for a smooth user experience.

------------------------------------------------------------------

# 🌤️ Weather App

Una aplicación web interactiva que muestra el clima actual y el pronóstico de cualquier ciudad del mundo 🌎.  
Utiliza datos meteorológicos en tiempo real y una integración con mapas dinámicos para visualizar la ubicación seleccionada.

[🔗 **Ver aplicación desplegada aquí**](https://edoliveros.github.io/WeatherApp/)  

---

## 🧭 Descripción general

Weather App te permite buscar el clima de cualquier ciudad escribiendo su nombre en el campo de búsqueda.  
La aplicación muestra:
- La ubicación exacta en un mapa dinámico.  
- El clima actual con iconos y detalles como temperatura, humedad, velocidad del viento y más.  
- Un resumen visual de las condiciones climáticas.  

Todo esto con un diseño limpio y responsivo, ideal tanto para escritorio como para móviles.

---

## 💻 Tecnologías utilizadas

| Tipo | Herramientas / Librerías |
|------|----------------------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Frameworks / Librerías** | - [Leaflet.js](https://leafletjs.com/) para mapas interactivos |
| **Fuentes** | [Google Fonts](https://fonts.google.com/) (Google Sans & Quicksand) |
| **Iconos** | [Weather Icons](https://erikflowers.github.io/weather-icons/) para representación visual del clima |
| **APIs** | - [OpenWeatherMap API](https://openweathermap.org/api) (datos meteorológicos)<br> - [OpenStreetMap](https://www.openstreetmap.org/) (mapas base) |

---

## ⚙️ Cómo funciona

1. El usuario ingresa el nombre de una **ciudad** en la barra de búsqueda.
2. El script (`weather-app.js`):
   - Captura el valor y llama a la **OpenWeatherMap API** para consultar los datos meteorológicos actuales.
   - Procesa la respuesta en formato JSON.
   - Muestra los datos de temperatura, humedad, descripción, icono e información del viento en el contenedor principal.
3. Simultáneamente, se utiliza **Leaflet.js** para mostrar la ubicación en un mapa interactivo.
4. Todo el contenido se renderiza dinámicamente dentro del DOM de manera fluida.
