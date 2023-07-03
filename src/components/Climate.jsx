import React, { useState, useEffect } from 'react';
import axios from 'axios';
import solIcon from '../assets/img/clear-sky.svg';
import brokenIcon from '../assets/img/broken-clouds.svg';
import fewIcon from '../assets/img/few-clouds.svg';
import mistIcon from '../assets/img/mist.svg';
import rainIcon from '../assets/img/rain.svg';
import scatteredIcon from '../assets/img/scattered-clouds.svg';
import showerIcon from '../assets/img/shower-rain.svg';
import snowIcon from '../assets/img/snow.svg';
import thunderstormIcon from '../assets/img/thunderstorm.svg';

const Climate = () => {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [isCelsius, setIsCelsius] = useState(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=702db53d7cc1716e17a361da70869dd7`;

    useEffect(() => {
        const savedData = localStorage.getItem('weatherData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    const saveDataToLocalStorage = (data) => {
        localStorage.setItem('weatherData', JSON.stringify(data));
    };

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            axios
                .get(url)
                .then((response) => {
                    setData(response.data);
                    saveDataToLocalStorage(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            setLocation('');
        }
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius(!isCelsius);
    };

    const convertToCelsius = (temperature) => {
        return Math.round(temperature - 273.15);
    };

    const convertToFahrenheit = (temperature) => {
        return Math.round((temperature - 273.15) * 9 / 5 + 32);
    };

    const getWeatherIcon = (description) => {
        const iconMap = {
            'clear sky': solIcon,
            'broken clouds': brokenIcon,
            'few clouds': fewIcon,
            mist: mistIcon,
            rain: rainIcon,
            'scattered clouds': scatteredIcon,
            'shower rain': showerIcon,
            snow: snowIcon,
            thunderstorm: thunderstormIcon,
        };

        return iconMap[description] || solIcon;
    };

    return (
        <div>
            <header>
                <h1 className="header-title">Weather app</h1>
                <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    onKeyPress={searchLocation}
                    type="text"
                    className="search-input"
                    placeholder="Buscar ciudad"
                />
            </header>
            <div className="container">
                <div className="card">
                    <div className="content">
                        <div className="location">
                            <p>{data.name}</p>
                        </div>
                        <div className="temperature">
                            {data.main ? (
                                <p>
                                    {isCelsius
                                        ? `${convertToCelsius(data.main.temp)}°C`
                                        : `${convertToFahrenheit(data.main.temp)}°F`}
                                </p>
                            ) : null}
                        </div>
                        <div className="description">
                            {data.weather ? <p>{data.weather[0].description}</p> : null}
                        </div>
                        <div className="Humidity">
                            {data.main ? <p>{data.main.humidity}% Humidity</p> : null}
                        </div>
                        <div className="lonLat">
                            {data.coord ? (
                                <p>
                                    Coord: {data.coord.lat}, {data.coord.lon}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <img
                        className="weather-icon"
                        src={getWeatherIcon(data.weather ? data.weather[0].description : '')}
                        alt="Icono de clima"
                    />
                </div>
                <button className="custom-button" onClick={toggleTemperatureUnit}>
                    Cambiar a {isCelsius ? 'F°' : 'C°'}
                </button>
            </div>
        </div>
    );
};

export default Climate;
