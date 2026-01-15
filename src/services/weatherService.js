const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_PROVIDER = import.meta.env.VITE_WEATHER_API_PROVIDER || 'openweathermap';

export const weatherService = {
    async getCurrentWeather(location) {
        if (!WEATHER_API_KEY) {
            console.warn('Weather API key not configured');
            return null;
        }

        try {
            if (WEATHER_PROVIDER === 'openweathermap') {
                return await getOpenWeatherMapData(location);
            } else if (WEATHER_PROVIDER === 'weatherapi') {
                return await getWeatherAPIData(location);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    },

    async getWeatherByCoords(lat, lon) {
        if (!WEATHER_API_KEY) {
            return null;
        }

        try {
            if (WEATHER_PROVIDER === 'openweathermap') {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
                );
                const data = await response.json();
                return formatOpenWeatherMapData(data);
            }
        } catch (error) {
            console.error('Error fetching weather by coords:', error);
            return null;
        }
    }
};

async function getOpenWeatherMapData(location) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    const data = await response.json();
    return formatOpenWeatherMapData(data);
}

function formatOpenWeatherMapData(data) {
    return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        location: data.name
    };
}

async function getWeatherAPIData(location) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`
    );
    const data = await response.json();

    return {
        temp: Math.round(data.current.temp_f),
        feelsLike: Math.round(data.current.feelslike_f),
        condition: data.current.condition.text,
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_mph),
        location: data.location.name
    };
}
