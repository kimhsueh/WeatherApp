import axios from "axios";
import React, { useEffect, useState } from "react";
import SevenDayCard from "./SevenDayCard";
import "../../Styles/CurrCondstyles.css";

const API_KEY = "dver4G8ujsltv2Mvou5yVoDrE4hzwtXo"; // NEED TO GET KEY
//const API_KEY = "8YL3RAs1YRq6aSGjjOiO03q9z703mYI"; // NEED TO GET KEY
//const API_KEY = "rAms6sXkB0zkMwGb0CCy5cgJ9y38e98F";
//const API_KEY = "9aZEAg1KCbHFxTKP92JuD8DiCN3knKHz";

// const LOCATION = "new york city"; // Need to make it something that can be read as input later
const SevenDay = ({ lat, lon }, props) => {
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const options = {
        method: "POST",
        url: "https://api.tomorrow.io/v4/timelines",
        params: {
          apikey: API_KEY,
        },
        headers: {
          accept: "application/json",
          "Accept-Encoding": "gzip",
          "content-type": "application/json",
        },
        data: {
          location: `${lat},${lon}`,
          fields: [
            "temperature",
            "temperatureMin",
            "temperatureMax",
            "weatherCode",
            "precipitationProbability",
          ],
          units: "imperial",
          timesteps: ["1d"],
          startTime: "now",
          endTime: "nowPlus120h",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          const weatherData = response.data.data.timelines[0].intervals;
          console.log(weatherData);
          setWeekData(weatherData);
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

  // const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (
    <div className="card-container sevenday">
      {weekData.map((day, index) => (
        <div>
          <SevenDayCard
            toFahrenheit={props.toFahrenheit}
            toCelsius={props.toCelsius}
            cardClass={index === 0 ? "weather-card-current" : "weather-card"}
            dayTextClass={index === 0 ? "day-text-current" : "day-text"}
            temperatureMinClass={index === 0 ? "min-temp-current" : "min-temp"}
            temperatureMaxClass={index === 0 ? "max-temp-current" : "max-temp"}
            startTime={index === 0 ? "today" : day.startTime}
            precipitationProbability={day.values.precipitationProbability}
            temperatureMax={day.values.temperatureMax}
            temperatureMin={day.values.temperatureMin}
            weatherCode={day.values.weatherCode}
          />
        </div>
      ))}
    </div>
  );
};

export default SevenDay;
