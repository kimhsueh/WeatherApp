import axios from "axios";
import React, { useEffect, useState } from "react";
import clear from "../../icons/clear.png";
import mostly_clear from "../../icons/mostly_clear.png";
import partly_cloudy from "../../icons/partly_cloudy.png";
import mostly_cloudy from "../../icons/mostly_cloudy.png";
import cloudy from "../../icons/cloudy.png";
import light_fog from "../../icons/light_fog.png";
import fog from "../../icons/fog.png";
import drizzle from "../../icons/drizzle.png";
import light_rain from "../../icons/light_rain.png";
import rain from "../../icons/rain.png";
import heavy_rain from "../../icons/heavy_rain.png";
import "../../Styles/hourlyForecast.css";
import "../../Styles/CurrCondstyles.css";
// const API_KEY = 'dver4G8ujsltv2Mvou5yVoDrE4hzwtXo'; // NEED TO GET KEY

// Kim's API key
//const API_KEY = "9aZEAg1KCbHFxTKP92JuD8DiCN3knKHz";
const API_KEY = "kYvp89KtCmsecgD2fcFaZoEiZ3ajTGGi";
//const API_KEY = "gGez44raOl1gJdIkSuNBfdn2u2CvmVHt";

const weatherCode = {
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
};

const DayForecast = ({ lat, lon }) => {
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const options = {
        method: "POST",
        url: "https://api.tomorrow.io/v4/timelines",
        params: { apikey: API_KEY },
        headers: {
          accept: "application/json",
          "Accept-Encoding": "gzip",
          "content-type": "application/json",
        },
        data: {
          location: `${lat},${lon}`,
          fields: ["temperature", "weatherCode"],
          units: "imperial",
          timesteps: ["1h"],
          startTime: "now",
          endTime: "nowPlus24h",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          const hourlyForecast = response.data.data.timelines[0].intervals;
          setHourlyData(hourlyForecast);
          console.log(hourlyForecast);
          setLoading(false);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [lat, lon]);

  //If things go wrong section
  if (loading) return <p>Loading - One Second Please</p>;
  if (error) return <p> Error: {error}</p>;

  return (
    <div className="weatherStyle">
      {hourlyData &&
        hourlyData.map((intervals, index) => {
          const weatherDescription = weatherCode[intervals.values.weatherCode];
          return (
            <div key={index} className="forecastCardStyle">
              <p className="info">
                {index === 0
                  ? "Now"
                  : new Date(intervals.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      hour12: true,
                    })}
              </p>
              <img src={weatherDescription} alt={weatherDescription} />
              <p>{Math.round(intervals.values.temperature)} °F</p>
            </div>
          );
        })}
    </div>
  );
};

export default DayForecast;
