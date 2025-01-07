import { useEffect, useState } from 'react';
import WeatherIcons from '../../assets/css/weather-icons.css';
import style from './Weather.module.css';

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
const WEATHER_TOKEN = process.env.NEXT_PUBLIC_WEATHER_TOKEN;

const WeatherMini = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Obtener la ubicación desde geolocalización si es posible
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
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

  // Fetch data after obtaining the location
  useEffect(() => {
    const fetchData = async () => {
      try {
        let lat = location.latitude;
        let lon = location.longitude;

        // Si no conseguimos latitud/longitud desde la geolocalización, recurrimos a ipinfo.io
        if (!lat || !lon) {
          const locationResponse = await fetch(`https://ipinfo.io?token=${API_TOKEN}`);
          if (!locationResponse.ok) {
            throw new Error(`Error en la solicitud de ubicación: ${locationResponse.status} - ${locationResponse.statusText}`);
          }

          const locationData = await locationResponse.json();
          const loc = locationData.loc.split(',');
          lat = loc[0];
          lon = loc[1];
        }

        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_TOKEN}&units=metric&lang=es`;

        const weatherResponse = await fetch(urlWeather);
        if (!weatherResponse.ok) {
          throw new Error('Error al obtener datos meteorológicos');
        }

        const weatherData = await weatherResponse.json();

        const conditionDescription = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const tempRedond = Math.floor(temp);

        // Obtener la fecha actual en la zona horaria de Chile
        const dateObject = new Date();
        const options = { timeZone: 'America/Santiago', year: 'numeric', month: 'long', day: 'numeric' };
        const chileDate = dateObject.toLocaleDateString('es-CL', options);
        setCurrentDate(chileDate);

        let iconClass;
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

    // Solo se hace la solicitud cuando la ubicación está disponible
    if (location.latitude && location.longitude) {
      fetchData();
    }
  }, [location]);

  return (
    <div className={`${style.weatherWidget}`}>
      {weatherData ? (
        <>
          <div className={`${style.weather_icon} flex gap-1 items-center`}>
            <i className={`${weatherData.iconClass} text-sm xl:text-5xl`}></i>
            <h4 className='text-sm xl:text-xl font-bold text-navy-700 dark:text-white'>
              <span className="hidden xl:block">{weatherData.city},</span> {weatherData.tempRedond}°C
            </h4>
          </div>
          <p className='font-dm text-sm font-medium text-gray-600 hidden xl:block'>{`${currentDate}`}</p>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default WeatherMini;
