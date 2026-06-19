const apiKey = "YOUR_API_KEY";

let weatherChart;

async function searchWeather() {

    const city = document.getElementById("cityInput").value;

    if(city === ""){
        alert("Please enter a city name");
        return;
    }

    try{

        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );

        const geoData = await geoResponse.json();

        if(geoData.length === 0){
            alert("City not found");
            return;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`
        );

        const weatherData = await weatherResponse.json();

        displayCurrentWeather(city, weatherData.current);

        displayForecast(weatherData.daily);

        drawChart(weatherData.daily);

    }
    catch(error){
        console.log(error);
        alert("Error fetching weather data");
    }
}

function displayCurrentWeather(city, current){

    document.getElementById("currentWeather").innerHTML = `
        <h2>${city}</h2>
        <h3>${current.temp} °C</h3>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_speed} m/s</p>
    `;
}

function displayForecast(days){

    let output = "";

    days.slice(0,7).forEach(day => {

        const date = new Date(day.dt * 1000);

        output += `
        <div class="forecast-card">
            <h3>${date.toLocaleDateString('en-US',{weekday:'short'})}</h3>
            <p>Min: ${day.temp.min}°C</p>
            <p>Max: ${day.temp.max}°C</p>
        </div>
        `;
    });

    document.getElementById("forecastContainer").innerHTML = output;
}

function drawChart(days){

    const labels = [];
    const temperatures = [];

    days.slice(0,7).forEach(day => {

        labels.push(
            new Date(day.dt * 1000)
            .toLocaleDateString('en-US',{weekday:'short'})
        );

        temperatures.push(day.temp.day);
    });

    const ctx = document.getElementById("weatherChart");

    if(weatherChart){
        weatherChart.destroy();
    }

    weatherChart = new Chart(ctx,{
        type:'line',
        data:{
            labels:labels,
            datasets:[{
                label:'Temperature (°C)',
                data:temperatures,
                tension:0.4
            }]
        }
    });
}
