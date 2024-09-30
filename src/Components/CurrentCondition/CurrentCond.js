import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import Map from "../../Map Parts/map";
import "../../Styles/CurrCondstyles.css";
import clear from "../../icons/clear.png";
import cloudy from "../../icons/cloudy.png";
import drizzle from "../../icons/drizzle.png";
import fog from "../../icons/fog.png";
import heavy_rain from "../../icons/heavy_rain.png";
import light_fog from "../../icons/light_fog.png";
import light_rain from "../../icons/light_rain.png";
import mostly_clear from "../../icons/mostly_clear.png";
import mostly_cloudy from "../../icons/mostly_cloudy.png";
import partly_cloudy from "../../icons/partly_cloudy.png";
import thunderstorm from "../../icons/thunderstorm.png";
import rain from "../../icons/rain.png";
import Alerts from "../Alerts/Alerts";
import CustomAlerts from "../Alerts/CustomAlerts";
import DayForecast from "../HourlyForecast/hourlyForecast";
import SevenDay from "../SevenDay/SevenDay";
const API_KEY = "o18gwd0RtxBP7Wu0UUhxwtORYW53mY0c"; // NEED TO GET KEY
//const API_KEY = "hcEAL1GZXcrvHRIWuXXnJpFlOX8QdKYt";
//const API_KEY = "9aZEAg1KCbHFxTKP92JuD8DiCN3knKHz";
const LOCATION = "new york city"; // Need to make it something that can be read as input later

const CurrentCond = ({ location, setLat, setLon }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null); //Liz addded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const codes = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm",
  };
  const weatherCodes = {
    0: "Unknown",
    1000: clear,
    1100: mostly_clear,
    1101: partly_cloudy,
    1102: mostly_cloudy,
    1001: cloudy,
    2000: fog,
    2100: light_fog,
    4000: drizzle,
    4001: rain,
    4200: light_rain,
    4201: heavy_rain,
    8000: thunderstorm,
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.tomorrow.io/v4/weather/realtime",
          {
            params: {
              location: location,
              apikey: API_KEY,
              units: "imperial",
            },
          }
        );
        const currentWeather = response.data.data.values;
        setWeatherData(currentWeather);

        // Liz added
        const currentLocation = response.data.location;
        setCurrentLocation(currentLocation);
        // Liz added ends here

        // Kim
        // setLat(currentLocation.lat);
        // setLon(currentLocation.lon);
        // end Kim

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, setLat, setLon]);

  //If things go wrong section
  if (loading) return <p>Loading - One Second Please</p>;
  if (error) return <p> Error: {error}</p>;

  const { lat, lon, name } = currentLocation; //Liz added

  const {
    temperature,
    windSpeed,
    humidity,
    weatherCode,
    time,
    precipitationProbability,
    uvIndex,
  } = weatherData;
  const temp = Math.round(temperature);
  const weatherImg = weatherCodes[weatherCode];
  const weatherDesc = codes[weatherCode];
  const currDate = new Date().toLocaleDateString();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var currDay = days[new Date().getDay()];
  const uv =
    uvIndex >= 0 && uvIndex <= 2
      ? "Low"
      : uvIndex >= 3 && uvIndex <= 5
      ? "Moderate"
      : uvIndex >= 6 && uvIndex <= 7
      ? "High"
      : uvIndex >= 8 && uvIndex <= 10
      ? "Very High"
      : "Extreme";

  //Front end part
  return (
    <div className="container">
      <div class="current-conditions">
        <div class="location">{location}</div>
        <div class="date">
          {currDay}, {currDate}
        </div>
        <div class="main-info">
          <div class="icon">
            <img src={weatherImg} alt={weatherDesc} />
          </div>
          <div class="temperature-condition">
            <div class="temperature">{temp}°F</div>
            <div class="condition">{weatherDesc}</div>
          </div>
          <div class="details">
            <div class="detail-item">
              <div class="detail-value">{windSpeed} mph</div>
              <div class="detail-label">Wind</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{humidity}%</div>
              <div class="detail-label">Humidity</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{precipitationProbability}%</div>
              <div class="detail-label">Rain</div>
            </div>
            <div class="detail-item">
              <a class="uv detail-value">{uvIndex}</a>
              <Tooltip anchorSelect=".uv" place="left">
                {uv}
              </Tooltip>
              <div class="detail-label">UV Index</div>
            </div>
          </div>
        </div>
      </div>
      {/*       <p>{location}</p> {/*Liz added*/}
      {/* <Map lat={lat} lon={lon} /> */} {/*Liz added*/}
      <div class="map-section">
        <div class="map">
          <Map lat={lat} lon={lon} />
        </div>
      </div>
      <SevenDay lat={lat} lon={lon} />
      <DayForecast lat={lat} lon={lon} />
      <Alerts lat={lat} lon={lon} />
      <div class="alert-section">
        <CustomAlerts currentTemperature={temp} lat={lat} lon={lon} />
      </div>
    </div>
  );
};

export default CurrentCond;
