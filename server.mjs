import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/weather/:location', (req, res) => {
    const location = req.params.location;
    fetch(`https://api.weather.gov/stations/${location}/observations/latest`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.properties.temperature.value;
            const temperatureUnit = data.properties.temperature.unitCode;
            res.json({ temperature, temperatureUnit });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch weather data' });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
