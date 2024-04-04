import { useEffect, useState } from 'react';
import WeatherIcons from '../../assets/css/weather-icons.css';
import style from './Weather.module.css';

const Weather = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la ubicación del usuario
        const token = 'd67e86b7c3745b';
        const locationResponse = await fetch('https://ipinfo.io?token=' + token);

        //console.log(locationResponse);

        // Verificar si la respuesta es exitosa
        if (!locationResponse.ok) {
          throw new Error(`Error en la solicitud de ubicación: ${locationResponse.status} - ${locationResponse.statusText}`);
        }

        // Obtener datos de ubicación como texto
        const locationDataText = await locationResponse.text();

        //console.log(locationDataText);

        // Convertir datos de ubicación a JSON
        const locationData = JSON.parse(locationDataText);

        const loc = locationData.loc.split(',');
        const lat = loc[0];
        const lon = loc[1];

        // Configurar la URL para obtener datos meteorológicos
        const api_key = 'c20739e8aad8361cce50d63bb646df6d';
        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=en`;

        // Obtener datos meteorológicos
        const weatherResponse = await fetch(urlWeather);

        // Verificar si la respuesta es JSON
        const contentType = weatherResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es un JSON válido');
        }

        const weatherData = await weatherResponse.json();

        // Procesar los datos meteorológicos
        const conditionDescription = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const tempRedond = Math.floor(temp);

        // Obtener la fecha actual en la zona horaria de Chile
        const chileTime = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

        // Formatear la fecha manualmente
        const dateObject = new Date();
        const options = { timeZone: 'America/Santiago', year: 'numeric', month: 'long', day: 'numeric' };
        const chileDate = dateObject.toLocaleDateString('es-CL', options);

        setCurrentDate(chileDate);

        // Asignar la clase de icono según la descripción del clima
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
          default:
            iconClass = 'wi wi-na';
            break;
        }

        // Actualizar el estado con los datos meteorológicos
        setWeatherData({
          iconClass,
          city,
          tempRedond,
        });
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    // Llamar a la función de obtención de datos
    fetchData();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  // Renderizar la información meteorológica
  return (
    <div className={`${style.weatherWidget}`}>
      {weatherData ? (
        <>
          <div className={`${style.weather_icon} flex gap-1 items-center`}>
            <i className={`${weatherData.iconClass} text-5xl`}></i>
            <h4 className='text-xl font-bold text-navy-700 dark:text-white'>{`${weatherData.city}, ${weatherData.tempRedond}°C`}</h4>
          </div>
          <p className='font-dm text-sm font-medium text-gray-600'>{`${currentDate}`}</p>
        </>
      ) : (
        <p>Cargando datos meteorológicos...</p>
      )}
    </div>
  );
};

export default Weather;
