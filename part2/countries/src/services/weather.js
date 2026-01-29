import axios from 'axios';

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const api_key = import.meta.env.VITE_WEATHER_KEY;

const getCountryWeather = (city) => {
  const request = axios.get(
    `${baseUrl}?q=${encodeURIComponent(city)}&appid=${api_key}&units=metric`,
  );
  return request.then((response) => {
    const data = response.data || {};
    const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : null;

    return {
      temperature: data.main?.temp,
      wind: data.wind?.speed,
      icon: iconCode ? `http://openweathermap.org/img/wn/${iconCode}@2x.png` : null,
    };
  });
};

export default { getCountryWeather }; 
