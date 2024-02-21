function getWeather() {
    const location = document.getElementById("location").value;
    fetch(`https://api.weather.gov/stations/${location}/observations/latest`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.properties.temperature.value;
            const temperatureUnit = data.properties.temperature.unitCode;
            document.getElementById("currentWeather").innerHTML = `Current Temperature: ${temperature} ${temperatureUnit}`;
            setWeatherWidgetTemperature(temperature);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("currentWeather").innerHTML = "Error fetching weather data.";
        });

    fetch(`https://api.weather.gov/stations/${location}/observations`)
        .then(response => response.json())
        .then(data => {
            const temperatureValues = data.features.map(feature => feature.properties.temperature.value);
            document.getElementById("temperatureTrends").innerHTML = `Temperature Trends for the Past Week: ${temperatureValues.join(", ")}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("temperatureTrends").innerHTML = "Error fetching temperature trends.";
        });
}

document.addEventListener("DOMContentLoaded", function() {
    setWeatherWidgetTemperature(""); // Initial widget state
});
