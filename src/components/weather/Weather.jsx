'use client';

import { useEffect, useState, useMemo } from 'react';
import WeatherIcons from '../../assets/css/weather-icons.css';
import style from './Weather.module.css';

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
const WEATHER_TOKEN = process.env.NEXT_PUBLIC_WEATHER_TOKEN;

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const memoizedLocation = useMemo(() => location, [location]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          //console.log("Tu ubicación exacta es:");
          //console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);
        },
        (err) => {
          console.error("Error al obtener la geolocalización:", err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("La API de Geolocalización no está soportada en este navegador.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await fetch(`https://ipinfo.io?token=${API_TOKEN}`);
        if (!locationResponse.ok) {
          throw new Error(`Error en la solicitud de ubicación: ${locationResponse.status} - ${locationResponse.statusText}`);
        }

        const locationData = await locationResponse.json();
        const loc = locationData.loc.split(',');
        const lat = location.latitude !== null ? location.latitude : loc[0];
        const lon = location.longitude !== null ? location.longitude : loc[1];

        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_TOKEN}&units=metric&lang=es`;
        //console.log(urlWeather);

        const weatherResponse = await fetch(urlWeather);
        if (!weatherResponse.ok) {
          throw new Error('Error al obtener datos meteorológicos');
        }

        const weatherData = await weatherResponse.json();

        const conditionDescription = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const tempRedond = Math.floor(temp);

        const dateObject = new Date();
        const options = { timeZone: 'America/Santiago', year: 'numeric', month: 'long', day: 'numeric' };
        const chileDate = dateObject.toLocaleDateString('es-CL', options);

        setCurrentDate(chileDate);

        let iconClass;
        //console.log(conditionDescription);
        switch (conditionDescription) {
          case 'clear sky':
            iconClass = 'wi wi-day-sunny';
            break;
          case 'few clouds':
            iconClass = 'wi wi-cloudy';
            break;
          case 'scattered clouds':
            iconClass = 'wi wi-day-cloudy';
            break;
          case 'broken clouds':
            iconClass = 'wi wi-cloudy';
            break;
          case 'shower rain':
            iconClass = 'wi wi-rain';
            break;
          case 'rain':
            iconClass = 'wi wi-showers';
            break;
          case 'overcast clouds':
            iconClass = 'wi wi-cloudy';
            break;
          case 'light rain':
            iconClass = 'wi wi-day-showers';
            break;
          case 'niebla':
            iconClass = 'wi wi-fog';
            break;
          case 'cielo claro':
            iconClass = 'wi wi-day-sunny';
            break;
          case 'nubes dispersas':
            iconClass = 'wi wi-day-cloudy';
            break;
          case 'nubes rotas':
            iconClass = 'wi wi-cloudy';
            break;
          case 'lluvia ligera':
            iconClass = 'wi wi-day-showers';
            break;
          case 'nubes sobrecargadas':
            iconClass = 'wi wi-cloudy';
            break;
          case 'tormenta eléctrica':
            iconClass = 'wi wi-thunderstorm';
            break;
          case 'lluvia moderada':
            iconClass = 'wi wi-showers';
            break;
          case 'lluvia':
            iconClass = 'wi wi-showers';
            break;
          case 'tormenta':
            iconClass = 'wi wi-storm-showers';
            break;
          case 'nieve':
            iconClass = 'wi wi-snow';
            break;
          case 'tormenta de nieve':
            iconClass = 'wi wi-snow';
            break;
          case 'nieve ligera':
            iconClass = 'wi wi-snow';
            break;
          default:
            iconClass = 'wi wi-na';
            break;
        }

        setWeatherData({
          iconClass,
          city,
          tempRedond,
        });
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    fetchData();
  }, [memoizedLocation]);

  return (
    <div className={`${style.weatherWidget}`}>
      {weatherData ? (
        <>
          <div className={`${style.weather_icon} flex gap-1 items-center`}>
            <i className={`${weatherData.iconClass} text-5xl text-blueQuinary dark:text-white`}></i>
            <h4 className='text-xl font-bold text-white dark:text-white'>
              {`${weatherData.city}, ${weatherData.tempRedond}°C`}
            </h4>
          </div>
          <p className='font-dm text-sm font-medium text-white'>{`${currentDate}`}</p>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Weather;
