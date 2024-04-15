import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import './weather.css';
import { useLocation } from 'react-router-dom';
import scatteredClouds from './scattered-thunder.gif';
import broken from './broken.gif';
import rain from './rain.gif'
import moderaterain from './mod-rain.gif';
import clearsky from './clearsky.gif';

interface WeatherData {
  date: string;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  weather_description: string;
}

interface WeatherList {
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

interface WeatherResponse {
  list: WeatherList[];
}

const WeatherInfo: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const location = useLocation();
  const latitude = location.state.lat;
  const longitude = location.state.lon;
  const name = location.state.name;

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=2a741736aa0694e290c31f828f11cb49&units=metric`
      );

      const filteredWeatherData: WeatherData[] = [];
      response.data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const existingData = filteredWeatherData.find(data => data.date === date);
        if (!existingData || item.main.temp_max > existingData.temp_max) {
          const weatherData: WeatherData = {
            date: date,
            temperature: item.main.temp,
            feels_like: item.main.feels_like,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            pressure: item.main.pressure,
            humidity: item.main.humidity,
            weather_description: item.weather[0].description
          };

          if (existingData) {
            const index = filteredWeatherData.findIndex(data => data.date === date);
            filteredWeatherData[index] = weatherData;
          } else {
            filteredWeatherData.push(weatherData);
          }
        }
      });

      setWeatherData(filteredWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getWeatherIcon = (description: string) => {
    const weatherIcons: Record<string, string> = {
      'clear sky': clearsky,
      'few clouds': 'https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif',
      'scattered clouds': scatteredClouds,
      'broken clouds': broken,
      'overcast clouds': 'https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif',
      'shower rain': 'https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif',
      'light rain': rain,
      'rain': rain,
      'moderate rain': moderaterain,
      'thunderstorm': 'https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif',
      'snow': 'https://example.com/snow.png',
      'mist': 'https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif'
    };

    if (weatherIcons.hasOwnProperty(description)) {
      return weatherIcons[description];
    } else {
      return 'https://example.com/default-icon.png';
    }
  }



  return (
    <>
      <Sidebar />
      <div className="weather-info-container">
        <h2>Weather Information for Next 5 Days in <span style={{ textTransform: 'uppercase', color: 'GREEN' }}>{name}</span></h2>
        <div className="weather-boxes-container">
          {weatherData.map((data, index) => (
            <div key={index} className="weather-box">
              <div className="weather-icon">
                <img src={getWeatherIcon(data.weather_description)} alt={data.weather_description} style={{ borderRadius: '35px', position: 'relative', left: '24px', top: '10px' }} />
              </div>
              <div className="weather-details">
                <p><strong>Date:</strong> {data.date}</p>
                <p><strong>Temperature:</strong> <span style={{ color: data.temperature > 25 ? 'red' : 'blue' }}>{data.temperature} °C</span></p>
                <p><strong>Feels Like:</strong> <span style={{ color: data.feels_like > 25 ? 'red' : 'blue' }}>{data.feels_like} °C</span></p>
                <p><strong>Min Temperature:</strong> <span style={{ color: data.temp_min > 25 ? 'red' : 'blue' }}>{data.temp_min} °C</span></p>
                <p><strong>Max Temperature:</strong> <span style={{ color: data.temp_max > 25 ? 'red' : 'blue' }}>{data.temp_max} °C</span></p>
                <p><strong>Pressure:</strong> <span style={{ color: data.pressure > 1000 ? 'red' : 'blue' }}>{data.pressure} hPa</span></p>
                <p><strong>Humidity:</strong> <span style={{ color: data.humidity > 50 ? 'red' : 'blue' }}>{data.humidity}%</span></p>
                <p><strong>Description:</strong> <span style={{color : 'brown', fontWeight : 'bold', textTransform : 'uppercase'}}>{data.weather_description}</span></p>
              </div>


            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherInfo;
