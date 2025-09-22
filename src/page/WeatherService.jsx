export const WeatherService = {
  async fetchWeather(city) {
    try {
      const API_URL =
        'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
      const response = await fetch(
        `${API_URL}${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
      );

      if (response.ok) {
        const data = await response.json();
        const weatherDescription = data.weather[0].description;
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const pressure = data.main.pressure;
        const visibility = (data.visibility / 1000).toFixed(1);
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        // Weather icons mapping
        const weatherIcons = {
          '01d': '☀️', // clear sky day
          '01n': '🌙', // clear sky night
          '02d': '⛅', // few clouds day
          '02n': '☁️', // few clouds night
          '03d': '☁️', // scattered clouds
          '03n': '☁️',
          '04d': '🌥️', // broken clouds
          '04n': '🌥️',
          '09d': '🌧️', // shower rain
          '09n': '🌧️',
          '10d': '🌦️', // rain day
          '10n': '🌧️', // rain night
          '11d': '⛈️', // thunderstorm
          '11n': '⛈️',
          '13d': '❄️', // snow
          '13n': '❄️',
          '50d': '🌫️', // mist
          '50n': '🌫️',
        };

        const icon = weatherIcons[data.weather[0].icon] || '🌈';
        const condition = data.weather[0].main.toLowerCase();

        // Background images based on weather condition
        const weatherBackgrounds = {
          clear:
            'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop',
          clouds:
            'https://images.unsplash.com/photo-1562155618-e1a8bc2eb04f?w=400&h=200&fit=crop',
          rain: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=200&fit=crop',
          thunderstorm:
            'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop',
          snow: 'https://images.unsplash.com/photo-1548780503-1a26f09e4e6b?w=400&h=200&fit=crop',
          mist: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop',
          drizzle:
            'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=200&fit=crop',
          default:
            'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop',
        };

        const backgroundImage =
          weatherBackgrounds[condition] || weatherBackgrounds.default;

        const weatherMessage = `
## ${icon} Weather Report for ${data.name}, ${data.sys.country}

### 🌡️ Current Conditions
**${
          weatherDescription.charAt(0).toUpperCase() +
          weatherDescription.slice(1)
        }** ${icon}

### 📊 Key Metrics
| Metric | Value |
|--------|-------|
| **Temperature** | ${temp}°C |
| **Feels Like** | ${feelsLike}°C |
| **Humidity** | ${humidity}% 💧 |
| **Wind Speed** | ${windSpeed} km/h 💨 |
| **Pressure** | ${pressure} hPa |
| **Visibility** | ${visibility} km |

### 🌅 Day Information
- **Sunrise**: ${sunrise} 🌅
- **Sunset**: ${sunset} 🌇

*Last updated: ${new Date().toLocaleTimeString()}*
*Data provided by OpenWeatherMap*`;

        const simpleMessage = `
<div class="weather-card">
  <div class="weather-header" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${backgroundImage}');">
    <h2>${icon} ${data.name}, ${data.sys.country}</h2>
    <p>${
      weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)
    }</p>
    <div class="temperature">${temp}°C</div>
  </div>
  
  <div class="weather-details">
    <div class="weather-grid">
      <div class="weather-item">
        <span class="icon">🌡️</span>
        <span class="label">Feels Like</span>
        <span class="value">${feelsLike}°C</span>
      </div>
      <div class="weather-item">
        <span class="icon">💧</span>
        <span class="label">Humidity</span>
        <span class="value">${humidity}%</span>
      </div>
      <div class="weather-item">
        <span class="icon">💨</span>
        <span class="label">Wind</span>
        <span class="value">${windSpeed} km/h</span>
      </div>
      <div class="weather-item">
        <span class="icon">⏲️</span>
        <span class="label">Pressure</span>
        <span class="value">${pressure} hPa</span>
      </div>
    </div>
    
    <div class="sun-times">
      <div class="sun-item">
        <span class="icon">🌅</span>
        <span>Sunrise: ${sunrise}</span>
      </div>
      <div class="sun-item">
        <span class="icon">🌇</span>
        <span>Sunset: ${sunset}</span>
      </div>
    </div>
  </div>
</div>`;

        return {
          type: 'html',
          content: simpleMessage,
          speakText: `Weather report for ${data.name}. Current conditions: ${weatherDescription}. Temperature: ${temp} degrees Celsius. Humidity: ${humidity} percent. Wind speed: ${windSpeed} kilometers per hour.`,
          rawData: data,
        };
      } else {
        const errorMessage = `
<div class="weather-error">
  <div class="error-icon">🌍</div>
  <h3>City Not Found</h3>
  <p>Sorry, I couldn't find weather information for "<strong>${city}</strong>"</p>
  <div class="suggestions">
    <p>💡 <strong>Suggestions:</strong></p>
    <ul>
      <li>Check the spelling of the city name</li>
      <li>Try using the format "City, Country"</li>
      <li>Make sure the city exists</li>
    </ul>
  </div>
</div>`;

        return {
          type: 'html',
          content: errorMessage,
          speakText: `City not found. Please check the city name ${city} and try again.`,
        };
      }
    } catch (error) {
      const errorMessage = `
<div class="weather-error">
  <div class="error-icon">⚠️</div>
  <h3>Connection Error</h3>
  <p>Unable to fetch weather information at this time.</p>
  <div class="suggestions">
    <p>🔧 <strong>Please check:</strong></p>
    <ul>
      <li>Your internet connection</li>
      <li>Weather service availability</li>
      <li>Try again in a few moments</li>
    </ul>
  </div>
</div>`;

      return {
        type: 'html',
        content: errorMessage,
        speakText:
          "Sorry, I couldn't fetch the weather information. Please check your internet connection and try again.",
      };
    }
  },
};
