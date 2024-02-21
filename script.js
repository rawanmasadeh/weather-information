function getWeather() {
    // clearing existing data before fetching new data 
    clearData();

    const stationId = document.getElementById("location").value;
    fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`)//to get current temp
        .then(response => response.json())
        .then(data => {
            const temperature = convertTemperature(data.properties.temperature.value, true);
            const currentWeather = document.getElementById("currentWeather");
            currentWeather.style.display = "block"; 
            currentWeather.innerHTML = `Current Temperature: <span class="current-temp">${temperature}°F</span>`;

            const latitude = data.geometry.coordinates[1];
            const longitude = data.geometry.coordinates[0];
            fetch(`https://api.weather.gov/points/${latitude},${longitude}`)//to get forecast for the input
                .then(response => response.json())
                .then(data => {
                    const forecastURL = data.properties.forecast;
                    fetch(forecastURL)
                        .then(response => response.json())
                        .then(data => {
                            const forecastData = data.properties.periods.slice(0, 7);
                            displayForecast(forecastData);
                        })
                        .catch(error => {
                            console.error('Error fetching forecast data:', error);
                            document.getElementById("forecast").innerHTML = "Error fetching forecast data.";
                        });
                })
                .catch(error => {
                    console.error('Error fetching grid points:', error);
                    document.getElementById("forecast").innerHTML = "Error fetching grid points.";
                });
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            document.getElementById("currentWeather").innerHTML = "Error fetching current weather data.";
        });
}

function clearData() {
    // clearing the forecast block
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = '';

    // clearing the temperature chart
    if (window.myTempChart) {
        window.myTempChart.destroy();
    }
}

function displayForecast(forecastData) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let forecastDays = [];
    let temperatures = [];
    let conditions = [];

    forecastData.forEach(day => {
        const date = new Date(day.startTime);
        const dayOfWeek = days[date.getDay()];
        const temp = convertTemperature(day.temperature, false);
        const condition = day.shortForecast;
        const emoji = getEmojiForCondition(condition);

        if (!forecastDays.includes(dayOfWeek)) {
            forecastDays.push(dayOfWeek);
            temperatures.push(temp);
            conditions.push(condition);
        }
    });

    // clearing forecast block
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = '';

    // Display the detailed forecast cards
    forecastDays.forEach((day, index) => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('forecast-day-card');
        dayCard.innerHTML = `<h3>${day} ${getEmojiForCondition(conditions[index])}</h3>
                             <p>Temp: ${temperatures[index]}°F</p>
                             <p>Condition: ${conditions[index]}</p>`;
        forecastContainer.appendChild(dayCard);
    });

    // update the temperature chart
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    if (window.myTempChart) {
        window.myTempChart.destroy(); // clear exisisting chart if any
    }
    window.myTempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastDays,
            datasets: [{
                label: 'Temperature (°F)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

//emojis for the most popular wetaher conditions
function getEmojiForCondition(condition) {
    switch (condition.toLowerCase()) {
        case 'rain':
            return '🌧️';
        case 'cloudy':
            return '☁️';
        case 'sunny':
            return '☀️';
        case "mostly clear":
            return "🌤️";
        case "mostly sunny":
            return "🌤️";
        case "showers and thunderstorms":
            return "⛈️";
        case "rain showers then mostly sunny":
            return "🌦️";
        case "partly cloudy":
            return "⛅";
        case "light rain likely":
            return "🌧️";
        case "slight chance light rain then partly cloudy":
            return "🌦️⛅";
        case "mostly cloudy":
            return "🌥️";           
        default:
            return "";        

    }
}


function convertTemperature(temperature, isCurrentTemp) {
    if (isCurrentTemp) {
        return ((temperature * 9/5) + 32).toFixed(0);
    } else {
        // all forecast temperatures are already in Fahrenheit
        return temperature.toFixed(0); 
    }
}
